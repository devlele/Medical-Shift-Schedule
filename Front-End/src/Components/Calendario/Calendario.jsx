import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import "./Calendario.css";

export default function Calendario({ eventos }) {
    return (
        <div className="calendario-container">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={ptBrLocale}
                height="auto"

                headerToolbar={{
                    left: "title",
                    center: "",
                    right: "prev,next"
                }}

                events={eventos}

                dateClick={(info) => {
                    alert("Data clicada: " + info.dateStr);
                }}
            />
        </div>
    );
}