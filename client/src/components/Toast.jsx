import { useToast } from '../context/ToastContext'

function Toast() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-item"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
            whiteSpace: 'nowrap',
            pointerEvents: 'auto',
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default Toast
