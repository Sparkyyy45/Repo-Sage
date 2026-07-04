import { ExternalLink, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  description: string;
  action?: EmptyStateAction;
  secondaryActions?: React.ReactNode;
  variant?: "default" | "compact";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryActions,
  variant = "default",
}: EmptyStateProps) {
  const renderAction = () => {
    if (!action) return null;

    const className =
      variant === "compact"
        ? "mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
        : "mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 transition-colors";

    if (action.onClick) {
      return (
        <button onClick={action.onClick} className={className}>
          {action.label}
        </button>
      );
    }

    return (
      <Link
        href={action.href!}
        target={action.external ? "_blank" : undefined}
        className={className}
      >
        {action.label}
        {action.external && <ExternalLink className="size-4" />}
      </Link>
    );
  };

  if (variant === "compact") {
    return (
      <div className="rounded-xl bg-muted/20 border border-dashed border-border/60 p-6 text-center">
        <Icon className="size-6 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{description}</p>
        {renderAction()}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/50">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {renderAction()}
      {secondaryActions && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {secondaryActions}
        </div>
      )}
    </div>
  );
}