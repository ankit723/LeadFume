
import UserButton from './UserButton';
import { getUser } from '@/app/actions';

const ClientUserButton = async() => {
  const user=await getUser()

  return <UserButton user={user} />;
};

export default ClientUserButton; 