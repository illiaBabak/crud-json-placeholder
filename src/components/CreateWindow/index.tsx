import { useContext } from 'react';
import { GlobalContext } from 'src/root';

type Props = {
  titleWindow: string;
  changeData: () => void;
  inputs: JSX.Element;
  isDisabledBtn: boolean;
  actionName: string;
};

export const CreateWindow = ({ titleWindow, changeData, inputs, isDisabledBtn, actionName }: Props): JSX.Element => {
  const { setShouldShowCreateWindow } = useContext(GlobalContext);

  return (
    <div className='create-window-wrapper' onClick={() => setShouldShowCreateWindow(false)}>
      <div className='create-window' onClick={(e) => e.stopPropagation()}>
        <div className='create-window-row'>
          <h2 className='title-create-window'>
            {actionName} {titleWindow}
          </h2>
          <div className='close-window-btn' onClick={() => setShouldShowCreateWindow(false)}>
            x
          </div>
        </div>

        <div>{inputs}</div>

        <div
          className={`create-btn ${isDisabledBtn ? 'disabled-btn' : ''}`}
          onClick={
            isDisabledBtn
              ? () => {}
              : () => {
                  setShouldShowCreateWindow(false);
                  changeData();
                }
          }
        >
          {actionName} {titleWindow}
        </div>
      </div>
    </div>
  );
};
