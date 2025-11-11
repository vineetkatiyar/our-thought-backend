export function paginate(query, totalCount = null) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 10, 1);
    const skip = (page - 1) * limit;
  
    const result = { page, limit, skip };
  
    if (totalCount !== null) {
      result.totalCount = totalCount;
      result.totalPages = Math.ceil(totalCount / limit);
      result.hasPrevious = page > 1;
      result.hasNext = page < result.totalPages;
    }
  
    return result;
  }