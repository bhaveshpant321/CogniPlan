"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";

export default function AddTopicModal() {
  const { isAddTopicModalOpen, closeAddTopicModal } = useUIStore();
  const [topicName, setTopicName] = useState("");
  const [subject, setSubject] = useState("");

  if (!isAddTopicModalOpen) return null;

  const handleSubmit = () => {
    if (!topicName.trim()) return;
    // TODO: Add to backend
    console.log("Adding topic:", topicName, "subject:", subject);
    setTopicName("");
    setSubject("");
    closeAddTopicModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">Add New Topic</h2>
          <button onClick={closeAddTopicModal} className="text-slate-400 hover:text-slate-200">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <InputField
            label="Topic Name"
            placeholder="e.g. CPU scheduling"
            value={topicName}
            onChange={setTopicName}
          />
          <InputField
            label="Subject (optional)"
            placeholder="e.g. Computer Science"
            value={subject}
            onChange={setSubject}
          />
          <div className="flex gap-3 pt-2">
            <Button onClick={closeAddTopicModal} variant="secondary" label="Cancel" className="flex-1" />
            <Button onClick={handleSubmit} label="Add Topic" className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}