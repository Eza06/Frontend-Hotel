import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortKey?: keyof T | string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFields?: (keyof T | string)[];
  filters?: FilterConfig[];
  onRowClick?: (row: T) => void;
  selectedRowId?: string | number | null;
  rowIdKey: keyof T;
  isLoading?: boolean;
  pageSize?: number;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = 'Cari...',
  searchFields = [],
  filters = [],
  onRowClick,
  selectedRowId,
  rowIdKey,
  isLoading = false,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 on search or filter change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, val: string) => {
    setActiveFilters(prev => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  // 1. Search & Filter logic
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchQuery.trim() && searchFields.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field as keyof T];
          return value ? String(value).toLowerCase().includes(query) : false;
        })
      );
    }

    // Filter
    Object.entries(activeFilters).forEach(([key, val]) => {
      if (val && val !== 'All') {
        result = result.filter(item => {
          const itemVal = item[key as keyof T];
          return itemVal ? String(itemVal) === val : false;
        });
      }
    });

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey as keyof T];
        const valB = b[sortKey as keyof T];

        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        const comparison = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
          sensitivity: 'base',
        });

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, searchFields, activeFilters, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {searchFields.length > 0 && (
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="pl-8 pr-2.5 py-1.5 w-full bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {filters.map(filt => (
            <div key={filt.key} className="flex items-center space-x-1.5 text-xs font-bold text-gray-400">
              <span className="text-[10px] uppercase">{filt.label}:</span>
              <select
                value={activeFilters[filt.key] || 'All'}
                onChange={(e) => handleFilterChange(filt.key, e.target.value)}
                className="p-1 px-2 bg-white border border-gray-300 rounded-md text-[10px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 cursor-pointer"
              >
                <option value="All">All</option>
                {filt.options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-3xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-200">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => col.sortKey && toggleSort(col.sortKey as string)}
                    className={`px-5 py-3 text-[10px] select-none ${
                      col.sortKey ? 'cursor-pointer hover:bg-gray-100 hover:text-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.header}</span>
                      {col.sortKey && sortKey === col.sortKey && (
                        <span className="text-[8px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {isLoading ? (
                // Shimmer Loader Rows
                Array.from({ length: pageSize }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="px-5 py-4">
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map(row => {
                  const idValue = row[rowIdKey];
                  const isSelected = selectedRowId !== undefined && selectedRowId === idValue;
                  return (
                    <tr
                      key={String(idValue)}
                      onClick={() => onRowClick?.(row)}
                      className={`transition-colors hover:bg-gray-50/75 ${
                        onRowClick ? 'cursor-pointer' : ''
                      } ${isSelected ? 'bg-blue-50/45 border-l-4 border-blue-500' : ''}`}
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className="px-5 py-3.5">
                          {col.accessor(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                // Empty state
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-gray-400 font-bold">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 bg-gray-55/30 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-semibold select-none">
            <span>
              Menampilkan {Math.min(processedData.length, (currentPage - 1) * pageSize + 1)} -{' '}
              {Math.min(processedData.length, currentPage * pageSize)} dari {processedData.length} item
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
