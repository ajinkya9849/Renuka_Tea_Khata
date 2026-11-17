export const formatCurrency = (amount: number | string | null | undefined): string => {
  const val = Number(amount || 0);
  return `₹${val.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })}`;
};

export const getInitials = (name: string): string => {
  if (!name) return 'RC';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatRelativeTime = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (isToday) {
      return `Today, ${timeStr}`;
    }
    if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    }

    const dayMonth = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
    return `${dayMonth}, ${timeStr}`;
  } catch {
    return dateStr;
  }
};
