import { useEffect, useRef, useState } from "react";
import type { Link } from "../../types/link/Link";
import { linkService } from "../../services/linkService";

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletedBackup, setDeletedBackup] = useState<Link | null>(null);
  const deleteTimers = useRef(new Map<string, number>());
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const result = await linkService.getLinks();

      if (result.success) {
        setLinks(result.data);
      } else {
        setError(result.error);
      }

      setLoading(false);
    };

    load();
  }, []);

  const toggleActive = async (id: string) => {
    try {
      const result = await linkService.toggleActive(id);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setLinks((prev) =>
        prev.map((l) =>
          l.id === id ? result.data : l
        )
      );
    } catch {
      setError("Failed to toggle link");
    }
  };

const remove = async (id: string) => {
  const target = links.find((l) => l.id === id);

  if (!target) return null;

  setLinks((prev) => prev.filter((l) => l.id !== id));

  const timer = window.setTimeout(async () => {
    try {
      const result = await linkService.deleteLink(id);

      if (!result.success) {
        setError(result.error);
        setLinks((prev) => [target, ...prev]);
      }
    } catch {
      setError("Failed to delete link");
      setLinks((prev) => [target, ...prev]);
    }

    deleteTimers.current.delete(id);

  }, 5000);

  deleteTimers.current.set(id, timer);

  return target;
};

  const restore = (link: Link) => {
  const timer = deleteTimers.current.get(link.id);

  if (timer) {
    clearTimeout(timer);
    deleteTimers.current.delete(link.id);
  }

  setLinks((prev) => [link, ...prev]);
};

  const addLocal = (link: Link) => {
    setLinks((prev) => [link, ...prev]);
  };

  return {
    links,
    setLinks,
    loading,
    error,
    toggleActive,
    remove,
    restore,
    addLocal
  };
}