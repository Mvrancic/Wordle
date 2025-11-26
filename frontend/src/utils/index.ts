export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'won':
      return 'text-green-500';
    case 'lost':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
};

export const getFeedbackColor = (status: 'correct' | 'present' | 'absent'): string => {
  switch (status) {
    case 'correct':
      return 'bg-green-500';
    case 'present':
      return 'bg-yellow-500';
    case 'absent':
      return 'bg-gray-500';
    default:
      return 'bg-gray-300';
  }
};

