import { AlertProps } from 'src/types/types';

type AlertComponentProps = AlertProps & {
  onClose: () => void;
  onMouseLeave: () => void;
  onMouseEnter: () => void;
};

export const Alert = ({
  text,
  type,
  onClose,
  position,
  onMouseEnter,
  onMouseLeave,
}: AlertComponentProps): JSX.Element => {
  return (
    <div className={`alert ${type} ${position}`} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
      <div className='alert-img' />
      <h2>{text}</h2>
      <div className='close-alert-btn' onClick={onClose}>
        x
      </div>
    </div>
  );
};
