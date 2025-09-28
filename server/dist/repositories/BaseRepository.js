"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
// Base Repository Class with generic typing
class BaseRepository {
    constructor(model) {
        if (!model) {
            throw new Error('Model is required for repository initialization');
        }
        this.model = model;
    }
    /**
     * Create a new record
     * @param data - The data to create
     * @param options - Sequelize creation options
     * @returns Promise of created record
     */
    create(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, options = {}) {
            try {
                const record = yield this.model.create(data, options);
                return record;
            }
            catch (error) {
                throw new Error(`Error creating ${this.model.name}: ${error.message}`);
            }
        });
    }
    /**
     * Find all records with optional filtering, pagination, and sorting
     * @param options - Query options
     * @returns Promise of paginated records with metadata
     */
    findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            try {
                const { where = {}, include = [], attributes, order = [['createdAt', 'DESC']], limit, offset, distinct = false } = options, otherOptions = __rest(options, ["where", "include", "attributes", "order", "limit", "offset", "distinct"]);
                const queryOptions = Object.assign({ where, include: include, order,
                    distinct }, otherOptions);
                if (attributes)
                    queryOptions.attributes = attributes;
                if (limit)
                    queryOptions.limit = parseInt(limit.toString());
                if (offset)
                    queryOptions.offset = parseInt(offset.toString());
                const result = yield this.model.findAndCountAll(queryOptions);
                const parsedLimit = limit ? parseInt(limit.toString()) : null;
                const parsedOffset = offset ? parseInt(offset.toString()) : 0;
                return {
                    data: result.rows,
                    total: result.count,
                    limit: parsedLimit,
                    offset: parsedOffset,
                    totalPages: parsedLimit ? Math.ceil(result.count / parsedLimit) : 1,
                };
            }
            catch (error) {
                throw new Error(`Error finding ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Find a single record by ID
     * @param id - Record ID
     * @param options - Query options
     * @returns Promise of found record or null
     */
    findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            try {
                const { include = [], attributes } = options, otherOptions = __rest(options, ["include", "attributes"]);
                const queryOptions = Object.assign({ where: { id }, include: include }, otherOptions);
                if (attributes)
                    queryOptions.attributes = attributes;
                const record = yield this.model.findOne(queryOptions);
                return record;
            }
            catch (error) {
                throw new Error(`Error finding ${this.model.name} by ID: ${error.message}`);
            }
        });
    }
    /**
     * Find a single record by conditions
     * @param where - Where conditions
     * @param options - Query options
     * @returns Promise of found record or null
     */
    findOne() {
        return __awaiter(this, arguments, void 0, function* (where = {}, options = {}) {
            try {
                const { include = [], attributes } = options, otherOptions = __rest(options, ["include", "attributes"]);
                const queryOptions = Object.assign({ where, include: include }, otherOptions);
                if (attributes)
                    queryOptions.attributes = attributes;
                const record = yield this.model.findOne(queryOptions);
                return record;
            }
            catch (error) {
                throw new Error(`Error finding ${this.model.name} record: ${error.message}`);
            }
        });
    }
    /**
     * Update a record by ID
     * @param id - Record ID
     * @param data - Data to update
     * @param options - Update options
     * @returns Promise of updated record or null
     */
    updateById(id_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (id, data, options = {}) {
            try {
                const { returning = true } = options, otherOptions = __rest(options, ["returning"]);
                const updateResult = yield this.model.update(data, Object.assign({ where: { id }, returning }, otherOptions));
                // Handle the result based on whether it's a tuple or just the count
                const updatedRowsCount = Array.isArray(updateResult) ? updateResult[0] : updateResult;
                if (updatedRowsCount === 0) {
                    return null;
                }
                return yield this.findById(id);
            }
            catch (error) {
                throw new Error(`Error updating ${this.model.name}: ${error.message}`);
            }
        });
    }
    /**
     * Update records by conditions
     * @param where - Where conditions
     * @param data - Data to update
     * @param options - Update options
     * @returns Promise of number of updated records
     */
    updateWhere(where_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (where, data, options = {}) {
            try {
                const [updatedRowsCount] = yield this.model.update(data, Object.assign({ where }, options));
                if (updatedRowsCount === 0) {
                    return null;
                }
                return yield this.findOne(where);
            }
            catch (error) {
                throw new Error(`Error updating ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Delete a record by ID
     * @param id - Record ID
     * @param options - Delete options
     * @returns Promise of boolean indicating if record was deleted
     */
    deleteById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            try {
                const deletedRowsCount = yield this.model.destroy(Object.assign({ where: { id } }, options));
                return deletedRowsCount > 0;
            }
            catch (error) {
                throw new Error(`Error deleting ${this.model.name}: ${error.message}`);
            }
        });
    }
    /**
     * Delete records by conditions
     * @param where - Where conditions
     * @param options - Delete options
     * @returns Promise of number of deleted records
     */
    deleteWhere(where_1) {
        return __awaiter(this, arguments, void 0, function* (where, options = {}) {
            try {
                const deletedRowsCount = yield this.model.destroy(Object.assign({ where }, options));
                return deletedRowsCount;
            }
            catch (error) {
                throw new Error(`Error deleting ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Check if record exists by ID
     * @param id - Record ID
     * @returns Promise of boolean indicating if record exists
     */
    existsById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.model.count({
                    where: { id },
                });
                return count > 0;
            }
            catch (error) {
                throw new Error(`Error checking ${this.model.name} existence: ${error.message}`);
            }
        });
    }
    /**
     * Count records with optional conditions
     * @param where - Where conditions
     * @param options - Count options
     * @returns Promise of number of records
     */
    count() {
        return __awaiter(this, arguments, void 0, function* (where = {}, options = {}) {
            try {
                const count = yield this.model.count(Object.assign({ where }, options));
                return count;
            }
            catch (error) {
                throw new Error(`Error counting ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Bulk create records
     * @param dataArray - Array of data objects
     * @param options - Bulk create options
     * @returns Promise of array of created records
     */
    bulkCreate(dataArray_1) {
        return __awaiter(this, arguments, void 0, function* (dataArray, options = {}) {
            try {
                if (!dataArray || dataArray.length === 0) {
                    throw new Error('Data array cannot be empty');
                }
                const records = yield this.model.bulkCreate(dataArray, Object.assign({ returning: true, validate: true }, options));
                return records;
            }
            catch (error) {
                throw new Error(`Error bulk creating ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Bulk update records
     * @param dataArray - Array of data objects with identifiers
     * @param options - Bulk update options
     * @returns Promise of number of updated records
     */
    bulkUpdate(dataArray_1) {
        return __awaiter(this, arguments, void 0, function* (dataArray, options = {}) {
            try {
                if (!dataArray || dataArray.length === 0) {
                    throw new Error('Data array cannot be empty');
                }
                let totalUpdated = 0;
                // Use transaction for bulk update to ensure atomicity
                yield this.model.sequelize.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    for (const item of dataArray) {
                        const { id } = item, updateData = __rest(item, ["id"]);
                        const [updatedCount] = yield this.model.update(updateData, Object.assign({ where: { id }, transaction }, options));
                        totalUpdated += updatedCount;
                    }
                }));
                return totalUpdated;
            }
            catch (error) {
                throw new Error(`Error bulk updating ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Bulk delete records by IDs
     * @param ids - Array of record IDs
     * @param options - Delete options
     * @returns Promise of number of deleted records
     */
    bulkDeleteByIds(ids_1) {
        return __awaiter(this, arguments, void 0, function* (ids, options = {}) {
            try {
                if (!ids || ids.length === 0) {
                    throw new Error('IDs array cannot be empty');
                }
                const deletedCount = yield this.model.destroy(Object.assign({ where: {
                        id: ids,
                    } }, options));
                return deletedCount;
            }
            catch (error) {
                throw new Error(`Error bulk deleting ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Bulk upsert records (create or update)
     * @param dataArray - Array of data objects
     * @param options - Upsert options with conflict fields
     * @returns Promise of array of [instance, created] tuples
     */
    bulkUpsert(dataArray_1) {
        return __awaiter(this, arguments, void 0, function* (dataArray, conflictFields = ['id'], options = {}) {
            try {
                if (!dataArray || dataArray.length === 0) {
                    throw new Error('Data array cannot be empty');
                }
                const results = [];
                // Use transaction for bulk upsert to ensure atomicity
                yield this.model.sequelize.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    for (const data of dataArray) {
                        // Build where condition based on conflict fields
                        const whereCondition = {};
                        conflictFields.forEach(field => {
                            if (data[field] !== undefined) {
                                whereCondition[field] = data[field];
                            }
                        });
                        const [instance, created] = yield this.model.findOrCreate(Object.assign({ where: whereCondition, defaults: data, transaction }, options));
                        if (!created) {
                            // Update the existing record
                            yield instance.update(data, { transaction });
                        }
                        results.push([instance, created]);
                    }
                }));
                return results;
            }
            catch (error) {
                throw new Error(`Error bulk upserting ${this.model.name} records: ${error.message}`);
            }
        });
    }
    /**
     * Execute a raw query (use with caution)
     * @param query - SQL query
     * @param options - Query options
     * @returns Promise of query results
     */
    rawQuery(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, options = {}) {
            try {
                const [results] = yield this.model.sequelize.query(query, Object.assign({ model: this.model, mapToModel: true }, options));
                return results;
            }
            catch (error) {
                throw new Error(`Error executing raw query: ${error.message}`);
            }
        });
    }
    /**
     * Create or update a record (upsert)
     * @param data - Data to upsert
     * @param options - Upsert options
     * @returns Promise of [instance, created] tuple
     */
    upsert(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, options = {}) {
            try {
                const result = yield this.model.upsert(data, Object.assign({ returning: true }, options));
                return result;
            }
            catch (error) {
                throw new Error(`Error upserting ${this.model.name}: ${error.message}`);
            }
        });
    }
    /**
     * Find or create a record
     * @param where - Where conditions to find
     * @param defaults - Default values if creating
     * @param options - Additional options
     * @returns Promise of [instance, created] tuple
     */
    findOrCreate(where_1) {
        return __awaiter(this, arguments, void 0, function* (where, defaults = {}, options = {}) {
            try {
                const result = yield this.model.findOrCreate(Object.assign({ where,
                    defaults }, options));
                return result;
            }
            catch (error) {
                throw new Error(`Error finding or creating ${this.model.name}: ${error.message}`);
            }
        });
    }
    /**
     * Execute operations within a transaction
     * @param callback - Function to execute within transaction
     * @returns Promise of callback result
     */
    transaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.sequelize.transaction(callback);
            }
            catch (error) {
                throw new Error(`Error in transaction: ${error.message}`);
            }
        });
    }
    /**
     * Get the model name
     * @returns Model name
     */
    getModelName() {
        return this.model.name;
    }
    /**
     * Get the model instance
     * @returns Sequelize model
     */
    getModel() {
        return this.model;
    }
}
exports.BaseRepository = BaseRepository;
exports.default = BaseRepository;
