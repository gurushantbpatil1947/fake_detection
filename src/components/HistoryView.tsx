import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  Filter, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { AnalysisRecord, ClassificationType } from '../types/index.ts';
import { api } from '../services/api.ts';

interface HistoryViewProps {
  onSelectAnalysis: (record: AnalysisRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelectAnalysis }) => {
  const [items, setItems] = useState<AnalysisRecord[]>([]);
  const [search, setSearch] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getHistory({
        search,
        classification: classificationFilter,
        page,
        limit: 10
      });
      if (res.success) {
        setItems(res.items);
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, classificationFilter, page]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis report from history?')) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await api.deleteAnalysis(id);
      if (res.success) {
        setItems(prev => prev.filter(i => i._id !== id));
        setTotal(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      alert('Failed to delete report.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Analysis Repository & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, review, and export previous AI news credibility assessments.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Total Records: <strong className="text-white tabular-nums">{total}</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by headline, keywords, or reasoning..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto w-full md:w-auto text-xs shrink-0">
          {(['All', 'Likely Credible', 'Potentially Misleading', 'Likely False', 'Insufficient Evidence'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setClassificationFilter(cat);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                classificationFilter === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Records Table */}
      <div className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Headline / Story Claim</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Date Evaluated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                      <span>Loading analysis records...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 space-y-2">
                    <AlertCircle className="h-6 w-6 text-slate-600 mx-auto" />
                    <p>No analysis records matched your filter criteria.</p>
                  </td>
                </tr>
              ) : (
                items.map((record) => {
                  const badgeColor =
                    record.classification === 'Likely Credible'
                      ? 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                      : record.classification === 'Potentially Misleading'
                      ? 'text-amber-400 bg-amber-950/40 border-amber-500/30'
                      : record.classification === 'Likely False'
                      ? 'text-rose-400 bg-rose-950/40 border-rose-500/30'
                      : 'text-slate-400 bg-slate-800 border-slate-700';

                  return (
                    <tr
                      key={record._id}
                      onClick={() => onSelectAnalysis(record)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-semibold text-white truncate">
                          {record.headline}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 max-w-sm">
                          {record.explanation}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badgeColor}`}>
                          {record.classification}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums whitespace-nowrap font-medium text-slate-200">
                        {Math.round(record.modelConfidence * 100)}%
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px] font-mono">
                        {new Date(record.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAnalysis(record);
                            }}
                            title="View Full Report"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, record._id)}
                            disabled={deletingId === record._id}
                            title="Delete Record"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-950/60 text-xs">
            <span className="text-slate-400">
              Page <strong className="text-white font-mono">{page}</strong> of <strong className="text-white font-mono">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
