import { useEffect, useState } from "react";
import type { Link } from "../../types/link/Link";
import { linkService } from "../../services/linkService";

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      // await linkService.toggleActive(id);

      setLinks((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, isActive: !l.isActive } : l
        )
      );
    } catch {
      setError("Failed to toggle link");
    }
  };

  const remove = async (id: string) => {
    try {
      // await linkService.deleteLink(id);

      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Failed to delete link");
    }
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
    addLocal,
  };
}