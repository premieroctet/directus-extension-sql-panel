<script lang="ts">
import { defineComponent } from 'vue';
import { ColumnMetaType, OptionListItem, SortType, TableVariant } from './type';

export default defineComponent({
  inject: ['api', 'env'],
  props: {
    primaryKey: {
      type: String || Number,
    },
    sql: {
      type: String,
      default: '',
    },
    default_column_width: {
      type: String,
      default: '150',
    },
    columns_meta: {
      type: Array<ColumnMetaType>,
    },
    is_using_entity_id: {
      type: Boolean,
      default: false,
    },
    table_variant: {
      type: String as () => TableVariant,
      default: 'normal',
    },
  },
  emits: ['input', 'update:sort'],
  setup(_, ctx) {
    const { emit } = ctx;
    emit('update:sort');
    return { handleChange };
    function handleChange(value: string) {
      emit('input', value);
    }
  },
  methods: {
    updateSort(sort: SortType) {
      if (!sort) return;
      const column = sort.by;
      const order = sort.desc ? 'DESC' : 'ASC';
      this.data = this.data.sort(
        (a: Record<string, any>, b: Record<string, any>) => {
          if (a[column] < b[column]) {
            return order === 'ASC' ? -1 : 1;
          }
          if (a[column] > b[column]) {
            return order === 'ASC' ? 1 : -1;
          }
          return 0;
        }
      );

      this.sort = sort;
    },
    onRowClick(payload) {
      const row = this.columns_meta.find(
        (item) => item.data_type === 'ressource_id'
      );

      if (row && this.data?.[0]?.id) {
        this.$router.push(
          `/content/${row.ressource_collection}/${payload.item.id}`
        );
      }
    },
    async loadData() {
      this.error = null;
      this.loading = true;

      try {
        const {
          data: { rows },
        } = (await this.fetchData()) as {
          data: {
            rows: Array<Record<string, any>>;
            command: string;
            rowCount: number;
            fields: any[];
          };
        };
        this.data = rows;

        if (rows.length > 0) {
          const hasIdColumn = rows.some((item: any) => item.id);
          const hasMetaRessource = this.columns_meta.some(
            (item: ColumnMetaType) => item.data_type === 'ressource_id'
          );
          this.shouldHaveClickableRows = hasIdColumn && hasMetaRessource;
          /* We set the clickable props (v-table) only when we have a clickable row feature (here, link to a ressource) */
        }
      } catch (err) {
        const errorMessage =
          err.response.data ||
          err.message ||
          err.code ||
          err.stack ||
          'Unknown error';
        this.error = errorMessage;
      } finally {
        this.loading = false;
      }
    },
    async getPrimaryKey(retry: number = 0) {
      /* If the fields loads before the item is done loading from the server: the primaryKey is '+'. So we wait .1s to get the real value */
      const MAX_RETRIES = 20;
      if (retry > MAX_RETRIES) {
        console.error('getPrimaryKey: too many retries, aborting.');
        return null;
      }
      const primaryKey = this.$props.primaryKey;
      if (primaryKey === '+') {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return this.getPrimaryKey(retry + 1);
      } else {
        return primaryKey;
      }
    },
    fetchData: async function () {
      const primaryKey = await this.getPrimaryKey();
      return await this.api.post(
        `/endpoints-sql-panel/${this.$attrs['field-data'].meta.id}`,
        {
          ...(this.is_using_entity_id && {
            entityId: primaryKey,
          }),
        }
      );
    },

    formatDateToDateTimeString(dateString: string) {
      const date = new Date(dateString);

      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };

      const formattedDate = date.toLocaleString('en-EN', options);

      return formattedDate.replace(/, /g, ' at ');
    },

    getChoice(value: string, columnIndex: number): OptionListItem {
      const choices: ColumnMetaType['options_list'] =
        this.columns_meta[columnIndex].options_list;

      console.log({ choices, value, columnIndex });

      if (!choices || choices.length === 0) {
        return {
          value,
          label: value,
        };
      }

      const choice = choices.find((item) => item.value === value);

      if (!choice) {
        return {
          value,
          label: value,
        };
      }

      console.log({ choice });

      return choice;
    },
  },

  computed: {
    rowHeight() {
      return this.table_variant === 'compact' ? 34 : 50;
    },
    tableHeaders() {
      const headers = Object.keys(this.data[0]).map((key, index) => {
        if (
          this.columns_meta &&
          this.columns_meta.length > 0 &&
          this.columns_meta[index] // if the column meta exists
        ) {
          return {
            text: this.columns_meta[index].label || key,
            value: key,
            width: this.columns_meta[index].width,
            sortable:
              this.columns_meta[index].sortable === false ? false : true,
            data_type: this.columns_meta[index].data_type,
            ...(this.columns_meta[index].data_type === 'ressource_id' && {
              ressource_collection:
                this.columns_meta[index].ressource_collection,
            }),
          };
        } else {
          return {
            text: key,
            value: key,
            sortable: true,
            width: this.default_column_width,
            data_type: 'string',
          };
        }
      });

      return headers;
    },
    resultsNumber() {
      return `${this.data.length} result${this.data.length > 1 ? 's' : ''}`;
    },
  },
  data() {
    return {
      loading: false as boolean,
      error: null as string | null,
      data: null as Array<Record<string, any>> | null,
      sort: null as SortType,
      shouldHaveClickableRows: false,
    };
  },
  created() {
    this.loadData();
  },
});
</script>

<template>
  <div class="flex-col">
    <div v-if="loading">
      <p>Loading ...</p>
    </div>
    <div v-if="data !== null && !error && !loading">
      <!-- Display data -->
      <div v-if="Array.isArray(data)" class="flex-col">
        <!-- Data is an array -->
        <v-table
          v-if="this.data.length > 0"
          :headers="tableHeaders"
          :items="data"
          :row-height="rowHeight"
          @update:sort="updateSort"
          @click:row="onRowClick"
          :sort="sort"
          class="table"
          :clickable="shouldHaveClickableRows"
          no-items-text="Pas de résultats"
        >
          <template
            v-for="(h, index) in tableHeaders"
            #[`header.${h.value}`]="{ header }"
          >
            <span :title="header.text" :key="index">{{
              header.data_type !== 'ressource_id' ? header.text : ''
            }}</span>
          </template>
          <template
            v-for="(header, index) in tableHeaders"
            #[`item.${header.value}`]="{ item }"
          >
            <div :key="index">
              <span v-if="header.data_type === 'string'">
                <!-- String -->
                {{ item[header.value] }}
              </span>

              <span v-else-if="header.data_type === 'date'">
                <!-- Date -->
                {{
                  item[header.value] &&
                  new Date(item[header.value]).toLocaleDateString()
                }}
              </span>

              <span v-else-if="header.data_type === 'date_time'">
                <!-- Datetime -->
                {{
                  item[header.value] &&
                  formatDateToDateTimeString(item[header.value])
                }}
              </span>

              <a v-else-if="header.data_type === 'ressource_id'">
                <!-- Ressource id -->
              </a>

              <span
                v-else-if="header.data_type === 'list'"
                v-bind:style="[
                  getChoice(item[header.value], index).color
                    ? { color: getChoice(item[header.value], index).color }
                    : {},
                ]"
              >
                <!-- Select -->
                {{ getChoice(item[header.value], index).label }}
              </span>

              <!-- Default -->
              <span v-else> {{ item[header.value] }} </span>
            </div>
          </template>
        </v-table>
        <p v-if="this.data.length > 1">{{ resultsNumber }}</p>
        <p v-else-if="this.data.length === 0">No results</p>
      </div>
    </div>
    <div v-if="error">
      <v-error :error="error" />
    </div>
  </div>
</template>

<style scoped>
.flex-col {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-direction: column;
}

.link {
  text-decoration: underline;
  color: var(--primary, #000);
  cursor: pointer;
  opacity: 0.8;
}
</style>
