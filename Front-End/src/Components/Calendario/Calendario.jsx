import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import "./Calendario.css";

export default function Calendario({ eventos }) {
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
        events={eventos}
        dayCellContent={renderDayCell}
        dateClick={(info) => {
          alert("Data clicada: " + info.dateStr);
        }}
      />
    </div>
  );
}
