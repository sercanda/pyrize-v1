"use client";

import { useState } from "react";
import { KanbanProvider, useKanban } from "@/contexts/KanbanContext";
import { Header } from "@/components/kanban/Header";
import { BoardWrapper } from "@/components/kanban/BoardWrapper";
import { ListView } from "@/components/kanban/ListView";
import { PlannerView } from "@/components/kanban/PlannerView";
import { GanttView } from "@/components/kanban/GanttView";
import { CalendarView } from "@/components/kanban/CalendarView";
import { TaskModal } from "@/components/kanban/TaskModal";
import { Task, TaskStatusColumn } from "@/types/kanban";

type ViewMode = "list" | "planner" | "gantt" | "dueDate" | "calendar";

function TodoPageContent() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultColumn, setDefaultColumn] = useState<TaskStatusColumn | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>("dueDate");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = (column?: TaskStatusColumn) => {
    setSelectedTask(null);
    setDefaultColumn(column);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setDefaultColumn(undefined);
  };

  const renderView = () => {
    switch (viewMode) {
      case "list":
        return <ListView onTaskClick={handleTaskClick} searchQuery={searchQuery} />;
      case "planner":
        return <PlannerView onTaskClick={handleTaskClick} />;
      case "gantt":
        return <GanttView onTaskClick={handleTaskClick} />;
      case "calendar":
        return <CalendarView onTaskClick={handleTaskClick} />;
      case "dueDate":
      default:
        return <BoardWrapper onTaskClick={handleTaskClick} onAddTask={handleAddTask} />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-[95vw] px-4 pb-16 pt-8 md:px-8">
      <Header
        onNewTask={() => handleAddTask()}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {renderView()}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultColumn={defaultColumn}
      />
    </div>
  );
}

export default function DashboardTodoPage() {
  return (
    <KanbanProvider>
      <TodoPageContent />
    </KanbanProvider>
  );
}
