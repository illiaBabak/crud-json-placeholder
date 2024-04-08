import { Header } from '../Header';
import { Alert } from '../Alert';
import { Loader } from '../Loader';
import { capitalize } from 'src/utils/capitalize';

type Props = {
  title: string;
  listElements: JSX.Element[];
  isError: boolean;
  isFetching: boolean;
};

export const Page = ({ title, listElements, isError, isFetching }: Props): JSX.Element => {
  return (
    <>
      <div className={`page-${title}`}>
        <Header title={capitalize(title)} />
        {isFetching ? <Loader /> : <div className='list'>{listElements}</div>}
      </div>

      {isError && <Alert />}
    </>
  );
};
