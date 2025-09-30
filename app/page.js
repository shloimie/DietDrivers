import { fetchDrivers } from "@/lib/api";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Truck, User, MapPin, ChevronRight, Hash } from "lucide-react";

export default async function Home() {
    const drivers = await fetchDrivers();

    return (
        <div style={{ display: "grid", gap: 16 }}>
            {drivers.map((d) => {
                const pct = d.totalStops ? (d.completedStops / d.totalStops) * 100 : 0;

                return (
                    <Link
                        key={d.id}
                        href={`/drivers/${d.id}`}
                        className="card theme"
                        style={{
                            "--brand": d.color,
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                        }}
                    >
                        <CardContent>
                            <div className="row">
                                <div className="flex">
                                    <div className="hdr-badge">
                                        <User />
                                    </div>
                                    <div>
                                        <div className="flex">
                                            <h2 style={{ fontSize: 20, fontWeight: 700, color: d.color }}>Route #{d.routeNumber}</h2>
                                            <ChevronRight className="muted" />
                                        </div>
                                        <div className="flex muted">


                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex muted" style={{ marginTop: 12 }}>
                                <MapPin style={{ height: 16, width: 16 }} />
                                <span>
                  {d.completedStops} / {d.totalStops} stops
                </span>
                            </div>

                            <div className="progress" style={{ marginTop: 10 }}>
                                <span style={{ width: `${pct}%` }} />
                            </div>
                        </CardContent>
                    </Link>
                );
            })}
        </div>
    );
}