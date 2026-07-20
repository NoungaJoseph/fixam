import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function Greeting() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="pt-10 pb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
        {t('dashboard.greeting.hi', { name: user?.firstName })}
      </h1>
    </div>
  );
}
