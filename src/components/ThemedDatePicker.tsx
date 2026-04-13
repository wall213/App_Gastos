import React, { useState, useEffect, useMemo } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  Modal, Dimensions, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/src/hooks/useThemeColors';

const { width } = Dimensions.get('window');

interface ThemedDatePickerProps {
  value: Date;
  visible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  title?: string;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const WEEKDAYS = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];

export const ThemedDatePicker: React.FC<ThemedDatePickerProps> = ({ 
  value, 
  visible, 
  onConfirm, 
  onCancel,
  title = 'Seleccionar Fecha'
}) => {
  const colors = useThemeColors();
  
  // Estado para la navegación del calendario
  const [currentDate, setCurrentDate] = useState(new Date(value));
  // Estado para la fecha seleccionada en el UI
  const [selectedDate, setSelectedDate] = useState(new Date(value));

  useEffect(() => {
    if (visible) {
      setCurrentDate(new Date(value));
      setSelectedDate(new Date(value));
    }
  }, [visible, value]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Lógica del calendario
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Dom) a 6 (Sab)
    
    // Ajustar para que la semana empiece en Lunes (0=Dom -> 6, 1=Lun -> 0)
    const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const days = [];
    
    // Espacios vacíos para el inicio del mes
    for (let i = 0; i < adjustedFirstDayIndex; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [year, month]);

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  const handleQuickSelect = (type: 'today' | 'lastWeek') => {
    const now = new Date();
    if (type === 'today') {
      setSelectedDate(now);
      setCurrentDate(now);
    } else if (type === 'lastWeek') {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      setSelectedDate(lastWeek);
      setCurrentDate(lastWeek);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>

          {/* Calendar Box */}
          <View style={[styles.calendarBox, { backgroundColor: colors.background }]}>
            {/* Navegador Mes */}
            <View style={styles.monthNavigator}>
              <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                <Ionicons name="chevron-back" size={20} color={colors.text} />
              </TouchableOpacity>
              
              <Text style={[styles.monthText, { color: colors.text }]}>
                {MONTHS[month]} {year}
              </Text>
              
              <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Labels Dias */}
            <View style={styles.weekdaysRow}>
              {WEEKDAYS.map(day => (
                <Text key={day} style={[styles.weekdayLabel, { color: colors.textSecondary }]}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Grid Dias */}
            <View style={styles.daysGrid}>
              {calendarDays.map((date, index) => (
                <View key={index} style={styles.dayCell}>
                  {date ? (
                    <TouchableOpacity 
                      onPress={() => setSelectedDate(date)}
                      style={[
                        styles.dayBtn,
                        isSelected(date) && [styles.selectedDay, { backgroundColor: colors.accent }]
                      ]}
                    >
                      <Text style={[
                        styles.dayText, 
                        { color: isSelected(date) ? '#fff' : colors.text },
                        isToday(date) && !isSelected(date) && { color: colors.accent, fontWeight: '800' }
                      ]}>
                        {date.getDate()}
                      </Text>
                      {isToday(date) && !isSelected(date) && <View style={[styles.todayDot, { backgroundColor: colors.accent }]} />}
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => onConfirm(selectedDate)} 
              style={[styles.applyBtn, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.applyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  calendarBox: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayBtn: {
    width: '85%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedDay: {
    shadowColor: '#3d5afe',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  todayDot: {
    position: 'absolute',
    bottom: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
  },
  applyBtn: {
    flex: 1,
    marginLeft: 20,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3d5afe',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  applyText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
