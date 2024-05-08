import { Header } from '../Header';
import { Loader } from '../Loader';
import { useContext } from 'react';
import { CreateWindow } from 'src/components/CreateWindow';
import { GlobalContext } from 'src/root';

type Props = {
  title: string;
  listElements: JSX.Element[];
  isLoading: boolean;
  inputs: JSX.Element;
  changeData: () => void;
  isDisabledBtn: boolean;
  isEdit: boolean;
  onResetState: () => void;
  searchInput: JSX.Element;
};

export const Page = ({
  title,
  listElements,
  isLoading,
  changeData,
  inputs,
  isDisabledBtn,
  isEdit,
  onResetState,
  searchInput,
}: Props): JSX.Element => {
  const { shouldShowCreateWindow, setShouldShowCreateWindow } = useContext(GlobalContext);
  const singularWord = title
    .split('')
    .slice(0, title.length - 1)
    .join('');

  return (
    <>
      <div className={`page-${title}`}>
        <Header title={title} searchInput={searchInput} />

        <div
          className='show-window-btn'
          onClick={() => {
            setShouldShowCreateWindow(true);
            onResetState?.();
          }}
        >
          Create a new {singularWord}
        </div>

        {isLoading ? <Loader /> : <div className='list'>{listElements}</div>}
      </div>

      {shouldShowCreateWindow && (
        <CreateWindow
          titleWindow={singularWord}
          changeData={changeData}
          inputs={inputs}
          isDisabledBtn={isDisabledBtn}
          actionName={isEdit ? 'Edit' : 'Create'}
        />
      )}
    </>
  );
};
