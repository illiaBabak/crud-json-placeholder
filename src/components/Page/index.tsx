import { Header } from '../Header';
import { Alert } from '../Alert';
import { Loader } from '../Loader';
import { useState } from 'react';
import { CreateWindow } from 'src/components/CreateWindow';

type Props = {
  title: string;
  listElements: JSX.Element[];
  isError: boolean;
  isFetching: boolean;
  inputs: JSX.Element;
  changeData: () => void;
  isDisabledBtn: boolean;
};

export const Page = ({
  title,
  listElements,
  isError,
  isFetching,
  changeData,
  inputs,
  isDisabledBtn,
}: Props): JSX.Element => {
  const [shouldShowCreateWindow, setShouldShowCreateWindow] = useState(false);
  const singularWord = title
    .split('')
    .slice(0, title.length - 1)
    .join('');

  return (
    <>
      <div className={`page-${title}`}>
        <Header title={title} />
        <div className='show-window-btn' onClick={() => setShouldShowCreateWindow(true)}>
          Create a new {singularWord}
        </div>
        {isFetching ? <Loader /> : <div className='list'>{listElements}</div>}
      </div>

      {isError && <Alert />}

      {shouldShowCreateWindow && (
        <CreateWindow
          titleWindow={singularWord}
          setShouldShowCreateWindow={setShouldShowCreateWindow}
          changeData={changeData}
          inputs={inputs}
          isDisabledBtn={isDisabledBtn}
        />
      )}
    </>
  );
};
