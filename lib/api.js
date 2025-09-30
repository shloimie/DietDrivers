// lib/api.js
// MOCK: drivers store only stop IDs; stops live in a separate table/map.

const mockStops = {
    "1": { id:"1", order:1, name:"Apex Electronics", address:"4521 Commerce Street", city:"Los Angeles", state:"CA", zip:"90058", phone:"(323) 555-0142", dislikes:"Leave at back door", completed:true },
    "2": { id:"2", order:2, name:"Green Valley Market", address:"892 Sunset Boulevard", city:"Los Angeles", state:"CA", zip:"90028", phone:"(323) 555-0199", dislikes:"No calls before 9am", completed:false },
    "3": { id:"3", order:3, name:"Sunrise Bakery", address:"1010 Melrose Ave", city:"Los Angeles", state:"CA", zip:"90046", phone:"(323) 555-0117", dislikes:"", completed:false },
    "21": { id:"21", order:1, name:"Harbor Supplies", address:"77 Ocean Ave", city:"Long Beach", state:"CA", zip:"90802", phone:"(562) 555-0101", dislikes:"Call on arrival", completed:false },
    "22": { id:"22", order:2, name:"Maple Grocery", address:"456 Maple St", city:"Torrance", state:"CA", zip:"90503", phone:"(310) 555-0102", dislikes:"", completed:false },
};

const mockDrivers = [
    { id:"d1", name:"Michael Torres", routeNumber:1, color:"#3665F3", stopIds:["1","2","3"] },
    { id:"d2", name:"Sarah Chen",    routeNumber:2, color:"#10b981", stopIds:["21","22"] },
];

const wait = (ms=200)=>new Promise(r=>setTimeout(r,ms));

export async function fetchDrivers() {
    await wait();
    return mockDrivers.map(d => {
        const stops = d.stopIds.map(id => mockStops[id]).filter(Boolean);
        const completed = stops.filter(s => s.completed).length;
        return { ...d, totalStops: stops.length, completedStops: completed };
    });
}

export async function fetchDriver(driverId) {
    await wait();
    return mockDrivers.find(d => d.id === driverId) ?? null;
}

export async function fetchStopsByIds(ids = []) {
    await wait();
    return ids.map(id => mockStops[id]).filter(Boolean).sort((a,b)=>(a.order??0)-(b.order??0));
}

export async function uploadProof(stopId, file) {
    await wait(300);
    const stop = mockStops[stopId];
    if (!stop) throw new Error("STOP_NOT_FOUND");
    // Mark as completed when an image is uploaded
    stop.completed = true;
    return { ok:true, stopId, completed:true, filename:file?.name ?? "proof.jpg" };
}