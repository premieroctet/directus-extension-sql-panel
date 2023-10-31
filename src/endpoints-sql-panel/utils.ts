import { EndpointExtensionContext } from '@directus/types/dist/endpoints';
import { SQLPanelFields } from '../interface-sql-panel/type';
import { ClientSafeErrorMessage } from './types';
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
  if (!sql) throw new ClientSafeError(ClientSafeErrorMessage.MISSING_SQL);
  if (!options.isUsingEntityId) {
    // Is not using entity id, so we should not find the param name
    if (sql.includes(PARAM_NAME)) {
      throw new ClientSafeError(
        ClientSafeErrorMessage.MISSING_IS_USING_ENTITY_ID
      );
    } else {
      return knex.raw(sql);
    }
  }
  if (options.isUsingEntityId) {
    // Is not using entity id
    if (!options.currentEntityId)
      throw new ClientSafeError(
        ClientSafeErrorMessage.MISSING_IS_USING_ENTITY_ID
      );
    const preparedSql = sql.replace(PARAM_NAME, options.currentEntityId);
    return knex.raw(preparedSql);
  }
}

export async function getFieldData(
  knex: Knex,
  fieldId: string
): Promise<Pick<SQLPanelFields, 'sql' | 'is_using_entity_id'>> {
  if (!fieldId)
    throw new ClientSafeError(ClientSafeErrorMessage.MISSING_FIELD_ID);
  const field = await knex('directus_fields').where({ id: fieldId }).first();
  if (!field) throw new ClientSafeError(`Field ${fieldId} not found`);
  const { sql, is_using_entity_id } = field.options as SQLPanelFields;
  if (!sql) throw new ClientSafeError(`Field ${fieldId} has no SQL option`);
  return {
    sql,
    is_using_entity_id: is_using_entity_id,
  };
}
