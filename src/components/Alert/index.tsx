import { AlertProps } from 'src/types/types';

type AlertComponentProps = AlertProps & {
  onClose: () => void;
  timeoutId: NodeJS.Timeout | null;
  setTimeoutId: React.Dispatch<React.SetStateAction<NodeJS.Timeout | null>>;
};

export const Alert = ({ text, type, onClose, position, timeoutId, setTimeoutId }: AlertComponentProps): JSX.Element => {
  const handleMouseEnter = () => {
    if (!timeoutId) return;

    clearTimeout(timeoutId);
    setTimeoutId(null);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      onClose();
    }, 5000);

    setTimeoutId(id);
  };

  return (
    <div className={`alert ${type} ${position}`} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <div className='alert-img' />
      <h2>{text}</h2>
      <div className='close-alert-btn' onClick={onClose}>
        x
      </div>
    </div>
  );
};
