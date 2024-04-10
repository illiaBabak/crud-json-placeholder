type Props = {
  titleWindow: string;
  setShouldShowCreateWindow: React.Dispatch<React.SetStateAction<boolean>>;
  changeData: () => void;
  inputs: JSX.Element;
  isDisabledBtn: boolean;
};

export const CreateWindow = ({
  titleWindow,
  setShouldShowCreateWindow,
  changeData,
  inputs,
  isDisabledBtn,
}: Props): JSX.Element => {
  return (
    <div className='create-window-wrapper' onClick={() => setShouldShowCreateWindow(false)}>
      <div className='create-window' onClick={(e) => e.stopPropagation()}>
        <div className='create-window-row'>
          <h2 className='title-create-window'>New {titleWindow}</h2>
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
          Create a new {titleWindow}
        </div>
      </div>
    </div>
  );
};
