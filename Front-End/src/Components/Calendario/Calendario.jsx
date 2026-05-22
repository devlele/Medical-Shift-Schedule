import React from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import "./Calendario.css";

export default function Calendario({ eventos }) {
  const navigate = useNavigate();
  const eventosNormalizados = eventos
    .map((evento, index) => ({
      id: evento.id ?? index + 1,
      title: evento.title || evento.hospital || evento.setor || "Plantão",
      date: evento.date || evento.dataInicio?.slice(0, 10),
      color: evento.color || "#1f7a63",
      kind: evento.kind || evento.dotType || "plantao",
      targetPath: evento.targetPath,
    }))
    .filter((evento) => evento.date);

  const getDotTypesOnDate = (date) => {
    const order = ["plantao", "cobertura", "pedido-proprio"];
    const types = new Set(
      eventosNormalizados
        .filter((event) => event.date === date)
        .map((event) => event.kind),
    );

    return order.filter((type) => types.has(type));
  };

  // Função para renderizar o conteúdo do dia
  const renderDayCell = (arg) => {
    const dateStr = arg.date.toISOString().split("T")[0];
    const dotTypes = getDotTypesOnDate(dateStr);

    return (
      <div className="day-content">
        <span className="day-number">{arg.dayNumberText}</span>
        {dotTypes.length > 0 && (
          <div className="calendar-dots">
            {dotTypes.map((type) => (
              <span className={`calendar-dot calendar-dot-${type}`} key={type} />
            ))}
          </div>
        )}
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
        events={eventosNormalizados.map((e, idx) => ({
          id: e.id ?? idx + 1,
          title: e.title,
          start: e.date,
          color: e.color,
          extendedProps: {
            targetPath: e.targetPath,
          },
        }))}
        dayCellContent={renderDayCell}
        dateClick={(info) => {
          const found = eventosNormalizados.find(
            (ev) => ev.date === info.dateStr,
          );
          if (found && found.id) {
            navigate(
              found.targetPath || `/UserPlantonista/DetalhePlantao/${found.id}`,
            );
          }
        }}
        eventClick={(info) => {
          if (info.event && info.event.id) {
            navigate(
              info.event.extendedProps.targetPath ||
                `/UserPlantonista/DetalhePlantao/${info.event.id}`,
            );
          }
        }}
      />
    </div>
  );
}
