export function ConfirmModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white dark:bg-card p-6 rounded-xl shadow-xl w-[90%] max-w-md">

        <h2 className="text-lg font-semibold text-primary mb-3">
          Confirm Submission
        </h2>

        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to send this message?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}
