export const trackEvent = (eventType, details = {}) => {
    try {
        let visitorUuid = localStorage.getItem('kestrel_uuid');
        
        if (!visitorUuid) {
            if (window.crypto && window.crypto.randomUUID) {
                visitorUuid = crypto.randomUUID();
            } else {
                visitorUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
            localStorage.setItem('kestrel_uuid', visitorUuid);
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://kestrel-cdn.example.com';

        const urlParams = new URLSearchParams(window.location.search);
        const paramsObj = Object.fromEntries(urlParams.entries());
        
        // 🚀 CRITICAL FIX: Map 'ref' to 'source' so the backend query finds it!
        if (paramsObj.ref) {
            paramsObj.source = paramsObj.ref;
            delete paramsObj.ref; // Optional: clean up the old key
        }
        
        const payload = JSON.stringify({
            domain: window.location.hostname,
            visitor_uuid: visitorUuid,
            event_type: eventType,
            details: { ...paramsObj, ...details } 
        });

        // 🚀 THE FIX: Use fetch with keepalive and credentials to pass Sanctum cookies
        fetch(`${baseUrl}/api/telemetria/evento`, {
            method: 'POST',
            keepalive: true,
            credentials: 'include', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: payload
        }).catch(err => console.error('Telemetry request failed:', err));

    } catch (error) {
        console.error('Telemetry failed:', error); 
    }
};