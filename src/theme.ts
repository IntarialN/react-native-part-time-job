export const theme = {
  colors: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    primary: '#1F7A8C',
    secondary: '#BFDBF7',
    textPrimary: '#0B1D51',
    textSecondary: '#4B5563',
    border: '#E5E7EB',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
  },
  typography: {
    title: 24,
    subtitle: 18,
    body: 16,
    caption: 13,
  },
} as const;

export type Theme = typeof theme;
