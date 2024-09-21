import { BellIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
    return (
        <button
        type="button"
        className="relative rounded-full text-primary-blue space-x-16"
      >
        <span className="sr-only">Ver notificaciones</span>
        <BellIcon aria-hidden="true" className="h-6 w-6" />
      </button>
    );
}
export default Notifications;