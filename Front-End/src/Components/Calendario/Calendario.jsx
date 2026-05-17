import React from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import "./Calendario.css";

export default function Calendario({ eventos }) {
  const navigate = useNavigate();
  // Função para verificar se há eventos em um dia
  const hasEventOnDate = (date) => {
    return eventos.some((event) => event.date === date);
  };

  // Função para renderizar o conteúdo do dia
  const renderDayCell = (arg) => {
    const dateStr = arg.date.toISOString().split("T")[0];
    const hasEvent = hasEventOnDate(dateStr);

    return (
      <div className="day-content">
        <span className="day-number">{arg.dayNumberText}</span>
        {hasEvent && <div className="bolinha"></div>}
      </div>
    );
  };

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
          right: "prev,next",
        }}
        events={eventos.map((e, idx) => ({
          id: e.id ?? idx + 1,
          title: e.title,
          start: e.date,
          color: e.color,
        }))}
        dayCellContent={renderDayCell}
        dateClick={(info) => {
          const found = eventos.find((ev) => ev.date === info.dateStr);
          if (found && found.id) {
            navigate(`/DetalhePlantao/${found.id}`);
          }
        }}
        eventClick={(info) => {
          if (info.event && info.event.id)
            navigate(`/DetalhePlantao/${info.event.id}`);
        }}
      />
    </div>
  );
}
