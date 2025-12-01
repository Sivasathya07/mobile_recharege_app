package src;

import java.util.ArrayList;
import java.util.List;

public class AlarmManager {
    private List<Alarm> alarms;
    
    public AlarmManager() {
        this.alarms = new ArrayList<>();
    }
    
    public void addAlarm(Alarm alarm) {
        if (!alarms.contains(alarm)) {
            alarms.add(alarm);
        }
    }
    
    public void removeAlarm(Alarm alarm) {
        alarms.remove(alarm);
    }
    
    public List<Alarm> getAlarms() {
        return new ArrayList<>(alarms);
    }
    
    public void clearAlarms() {
        alarms.clear();
    }
}