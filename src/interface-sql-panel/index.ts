import { defineInterface } from '@directus/utils';
import Interface from './interface.vue';

export default defineInterface({
  id: 'interface-sql-panel',
  name: 'SQL Panel',
  icon: 'dynamic_form',
  component: Interface,
  localTypes: ['presentation'],
  group: 'presentation',
  types: ['alias'],
  description:
    'Display the result of a SQL query, use $entityId to get the id of the current entity.',
  options: [
    {
      required: false,
      field: 'table_variant',
      name: 'Variant',
      type: 'string',
      schema: {
        default_value: 'normal',
      },
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            {
              value: 'compact',
              text: 'Compact',
            },
            {
              value: 'normal',
              text: 'Normal',
            },
          ],
        },
      },
    },
    {
      field: 'is_using_entity_id',
      name: "Use the current entity's id (with $entityId)",
      type: 'boolean',
      meta: {
        interface: 'toggle',
        width: 'full',
        required: true,
      },
      schema: {
        default_value: false,
      },
    },
    {
      field: 'sql',
      name: 'SQL Query',
      type: 'string',
      meta: {
        required: true,
        width: 'full',
        interface: 'input-multiline',
      },
      schema: {
        name: 'id',
        data_type: 'string',
        default_value: null,
        max_length: null,
        numeric_precision: 32,
        numeric_scale: 0,
        is_nullable: false,
        is_primary_key: true,
        has_auto_increment: true,
        foreign_key_column: null,
        foreign_key_table: null,
        comment: null,
      },
    },
    {
      field: 'default_column_width',
      name: 'Default column width',
      type: 'string',
      meta: {
        default_value: '150',
        width: 'full',
        interface: 'input',
        options: {
          placeholder: '$t:width',
        },
      },
    },
    {
      field: 'columns_meta',
      name: 'Columns',
      required: true,
      type: 'json',
      meta: {
        width: 'full',
        interface: 'list',
        options: {
          template: '{{ label }} ({{ width }}px) - {{ data_type }}',
          fields: [
            {
              field: 'label',
              type: 'string',
              name: '$t:label',
              required: true,
              meta: {
                width: 'full',
                interface: 'system-input-translated-string',
                options: {
                  placeholder: '$t:label',
                },
              },
            },
            {
              field: 'width',
              name: '$t:width',
              type: 'string',
              schema: {
                default_value: '150',
              },
              meta: {
                width: 'half',
                interface: 'input',
                options: {
                  placeholder: '$t:width',
                },
              },
            },
            {
              field: 'sortable',
              name: '$t:sortable',
              type: 'boolean',
              meta: {
                width: 'half',
                interface: 'toggle',
              },
              schema: {
                default_value: true,
              },
            },
            {
              required: true,
              field: 'data_type',
              name: 'Type',
              type: 'string',
              schema: {
                default_value: 'string',
              },
              meta: {
                interface: 'select-dropdown',
                options: {
                  choices: [
                    {
                      value: 'string',
                      text: 'Text',
                    },
                    {
                      value: 'date',
                      text: 'Date',
                    },
                    {
                      value: 'ressource_id',
                      text: 'Ressource ID',
                    },
                    {
                      value: 'date_time',
                      text: 'Date Time',
                    },
                    {
                      value: 'list',
                      text: 'List of options (for custom values)',
                    },
                  ],
                },
              },
            },
            {
              required: false,
              field: 'ressource_collection',
              name: 'Ressource collection',
              type: 'string',
              meta: {
                interface: 'input',
                options: {
                  placeholder: '$t:ressource_collection',
                },
                conditions: [
                  {
                    rule: {
                      data_type: {
                        _neq: 'ressource_id',
                      },
                    },
                    hidden: true,
                  },
                ],
              },
            },
            {
              required: false,
              field: 'options_list',
              name: 'List of options',
              type: 'json',
              meta: {
                interface: 'list',
                width: 'full',
                options: {
                  addLabel: 'Add option',
                  template: '{{ label }} - {{ value }}',
                  fields: [
                    {
                      field: 'label',
                      type: 'string',
                      name: '$t:label',
                      required: true,
                      meta: {
                        width: 'half',
                        interface: 'system-input-translated-string',
                        options: {
                          placeholder: '$t:label',
                        },
                      },
                    },
                    {
                      field: 'value',
                      type: 'string',
                      name: '$t:value',
                      required: true,
                      meta: {
                        width: 'half',
                        interface: 'input',
                        options: {
                          placeholder: '$t:value',
                        },
                      },
                    },
                    {
                      field: 'color',
                      type: 'string',
                      name: '$t:color',
                      required: false,
                      meta: {
                        width: 'half',
                        interface: 'select-color',
                        options: {
                          placeholder: '$t:color',
                        },
                      },
                    },
                  ],
                },
                conditions: [
                  {
                    rule: {
                      data_type: {
                        _neq: 'list',
                      },
                    },
                    hidden: true,
                  },
                ],
              },
            },
          ],
        },
      },
    },
  ],
});
