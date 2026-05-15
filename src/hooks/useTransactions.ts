import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import { useAlertStore } from '@/src/store/useAlertStore';

export function useTransactions() {
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();

  const deleteTransaction = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('Transaccion')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      // Reset root keys to force immediate refetch and clear cache
      queryClient.resetQueries({ queryKey: ['transactions'] });
      queryClient.resetQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryDetail'] });
      queryClient.invalidateQueries({ queryKey: ['cashFlow'] });
      queryClient.invalidateQueries({ queryKey: ['totalBalance'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTracking'] });
      
      showAlert({
        title: 'Éxito',
        message: 'El movimiento ha sido eliminado correctamente.',
        type: 'success',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting transaction:', error);
      showAlert({
        title: 'Error',
        message: 'No se pudo eliminar el movimiento: ' + (error.message || 'Error desconocido'),
        type: 'error',
      });
    },
  });

  return {
    deleteTransaction,
  };
}
