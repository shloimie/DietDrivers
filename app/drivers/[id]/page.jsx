"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDriver, fetchStopsByIds, uploadProof } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mapsUrlFromAddress } from "@/lib/maps";
import { CheckCircle2, MapPin, Phone, Upload, Clock, Hash } from "lucide-react";

export default function DriverDetail() {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const d = await fetchDriver(id);
                if (!d) throw new Error("DRIVER_NOT_FOUND");
                const s = await fetchStopsByIds(d.stopIds);
                if (active) {
                    setDriver(d);
                    setStops(s);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, [id]);

    const doneCount = useMemo(() => stops.filter(s => s.completed).length, [stops]);
    const pct = stops.length ? (doneCount / stops.length) * 100 : 0;

    const handleUpload = async (stopId, file) => {
        if (!file) return;
        setUploadingId(stopId);
        try {
            await uploadProof(stopId, file); // mock sets completed=true
            setStops(prev => prev.map(s => s.id === stopId ? { ...s, completed: true } : s));
        } catch (e) {
            alert(e.message || "Upload failed");
        } finally {
            setUploadingId(null);
        }
    };

    if (loading) return <div className="muted">Loading route…</div>;
    if (!driver) return <div className="muted">Driver not found.</div>;

    return (
        <div className="theme" style={{ '--brand': driver.color }}>
            <header className="card" style={{ background:"linear-gradient(0deg, var(--brand), var(--brand))", color:"#fff" }}>
                <CardContent>
                    <div className="row">
                        <div className="flex">
                            <div className="hdr-badge" style={{ background:"#fff", color:"var(--brand)" }}>
                                <Hash />
                            </div>
                            <div>
                                <h1 className="h1" style={{ color:"white", margin:0 }}>Route {driver.routeNumber}</h1>
                                <div style={{ opacity:.9 }}>{driver.name}</div>
                            </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:28, fontWeight:800 }}>{doneCount}/{stops.length}</div>
                            <div style={{ opacity:.85 }}>Completed</div>
                        </div>
                    </div>

                    <div style={{ marginTop:16, background:"rgba(255,255,255,.15)", borderRadius:12, padding:16 }}>
                        <div style={{ opacity:.9, marginBottom:8, fontSize:14 }}>Progress</div>
                        <div className="progress">
                            <span style={{ width:`${pct}%`, background:"#fff" }} />
                        </div>
                    </div>
                </CardContent>
            </header>

            <section style={{ display:"grid", gap:16, marginTop:24 }}>
                {stops.map((s, idx) => {
                    const done = !!s.completed;
                    const mapsUrl = mapsUrlFromAddress(s);
                    return (
                        <Card key={s.id} className={`stop-card ${done ? "stop-done" : ""}`}>
                            <CardContent>
                                <div className="row" style={{ alignItems:"flex-start" }}>
                                    <div>
                                        <div className="flex" style={{ gap:8 }}>
                                            {done ? (
                                                <CheckCircle2 color="var(--success)" />
                                            ) : (
                                                <span className="pill">{idx+1}</span>
                                            )}
                                            <h2 className="bold" style={{ fontSize:18, margin:0 }}>{s.name}</h2>
                                            {done && <span className="muted" style={{ fontSize:14 }}>Done</span>}
                                        </div>

                                        <div className="kv">
                                            <div className="flex muted">
                                                <MapPin style={{ height:16, width:16 }} />
                                                <span>{s.address}, {s.city}, {s.state} {s.zip}</span>
                                            </div>
                                            {s.phone && (
                                                <div className="flex muted">
                                                    <Phone style={{ height:16, width:16 }} />
                                                    <a className="link" href={`tel:${s.phone}`}>{s.phone}</a>
                                                </div>
                                            )}
                                            {s.dislikes && (
                                                <div className="flex muted">
                                                    <span style={{ fontWeight:600 }}>Dislikes:</span>
                                                    <span>{s.dislikes}</span>
                                                </div>
                                            )}
                                            {done && (
                                                <div className="flex muted">
                                                    <Clock style={{ height:16, width:16 }} />
                                                    <span>Completed</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                                        <a className="btn" href={mapsUrl} target="_blank" rel="noreferrer">Open in Maps</a>
                                        <label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display:"none" }}
                                                onChange={(e)=>handleUpload(s.id, e.target.files?.[0])}
                                                disabled={uploadingId === s.id}
                                            />
                                            <div className={`btn btn-outline ${uploadingId===s.id ? "muted" : ""}`} style={{ width:160, cursor:"pointer" }}>
                                                <Upload style={{ height:16, width:16, marginRight:8 }} />
                                                {uploadingId===s.id ? "Uploading…" : (done ? "Re-upload Photo" : "Upload Photo")}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>
        </div>
    );
}