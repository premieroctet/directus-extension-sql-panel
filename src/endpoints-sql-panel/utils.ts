import { EndpointExtensionContext } from '@directus/types/dist/endpoints';
import { SQLPanelFields } from '../interface-sql-panel/type';
type Knex = EndpointExtensionContext['database'];

export class ClientSafeError extends Error {
  isClientSafe: boolean;
  constructor(message: string) {
    super(message);
    this.isClientSafe = true;
  }
}

export async function executeRawSQL(
  knex: Knex,
  sql: string,
  options: {
    isUsingEntityId: boolean;
    currentEntityId?: string;
  }
) {
  const PARAM_NAME = '$entityId';
  if (!sql) throw new ClientSafeError('Missing sql');
  if (!options.isUsingEntityId) return knex.raw(sql);
  if (options.isUsingEntityId) {
    if (!options.currentEntityId)
      throw new ClientSafeError('Missing currentEntityId');
    const preparedSql = sql.replace(PARAM_NAME, options.currentEntityId);
    return knex.raw(preparedSql);
  }
}

export async function getFieldData(
  knex: Knex,
  fieldId: string
): Promise<Pick<SQLPanelFields, 'sql' | 'is_using_entity_id'>> {
  if (!fieldId) throw new ClientSafeError('Missing fieldId');
  const field = await knex('directus_fields').where({ id: fieldId }).first();
  if (!field) throw new ClientSafeError(`Field ${fieldId} not found`);
  const { sql, is_using_entity_id } = field.options as SQLPanelFields;
  if (!sql) throw new ClientSafeError(`Field ${fieldId} has no sql option`);
  return {
    sql,
    is_using_entity_id: is_using_entity_id,
  };
}
