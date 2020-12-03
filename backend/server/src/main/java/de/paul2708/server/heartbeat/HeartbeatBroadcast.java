package de.paul2708.server.heartbeat;

import de.paul2708.server.ws.Broadcaster;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public final class HeartbeatBroadcast {

    private final Broadcaster broadcaster;

    private final TimeUnit unit;
    private final long period;

    private final ScheduledExecutorService executorService;

    public HeartbeatBroadcast(Broadcaster broadcaster, TimeUnit unit, long period) {
        this.broadcaster = broadcaster;
        this.unit = unit;
        this.period = period;

        this.executorService = Executors.newScheduledThreadPool(1);
    }

    public void start() {
        executorService.scheduleAtFixedRate(() -> {
            broadcaster.broadcastToEveryone(new HeartbeatMessage());
        }, period, period, unit);
    }

    public void stop() {
        executorService.shutdown();
    }
}