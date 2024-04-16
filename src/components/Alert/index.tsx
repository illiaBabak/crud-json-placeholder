import { AlertProps } from 'src/types/types';

type AlertComponentProps = AlertProps & {
  onClose: () => void;
};

export const Alert = ({ text, type, onClose, position }: AlertComponentProps): JSX.Element => (
  <div className={`alert ${type} ${position}`}>
    <div className='alert-img' />
    <h2>{text}</h2>
    <div className='close-alert-btn' onClick={onClose}>
      x
    </div>
  </div>
);
