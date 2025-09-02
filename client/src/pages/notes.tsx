import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, StickyNote } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@shared/schema";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: notes = [], isLoading } = useQuery<Note[]>({ queryKey: ["/api/notes"] });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: any) => {
      const response = await apiRequest("POST", "/api/notes", noteData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsAddDialogOpen(false);
      setNewNote({ title: "", content: "", tags: "" });
      toast({ title: "Note created successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to create note", variant: "destructive" });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Note>) => {
      const response = await apiRequest("PATCH", `/api/notes/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setEditingNote(null);
      toast({ title: "Note updated successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to update note", variant: "destructive" });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({ title: "Note deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete note", variant: "destructive" });
    },
  });

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim()) return;

    const tags = newNote.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
    
    if (editingNote) {
      updateNoteMutation.mutate({
        id: editingNote.id,
        title: newNote.title,
        content: newNote.content,
        tags,
      });
    } else {
      createNoteMutation.mutate({
        title: newNote.title,
        content: newNote.content,
        tags,
      });
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags?.join(", ") || "",
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setNewNote({ title: "", content: "", tags: "" });
    setEditingNote(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="notes-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">Notes</h1>
          <p className="text-muted-foreground">Organize your thoughts and study materials</p>
        </div>
        
        <Dialog 
          open={isAddDialogOpen} 
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button data-testid="button-add-note">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" data-testid="dialog-note">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  data-testid="input-note-title"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Write your note content here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={8}
                  data-testid="textarea-note-content"
                />
              </div>
              <div>
                <Input
                  placeholder="Tags (comma separated)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  data-testid="input-note-tags"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  data-testid="button-cancel-note"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                  data-testid="button-save-note"
                >
                  {editingNote ? "Update Note" : "Create Note"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="mb-6" data-testid="search">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-notes"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="notes-grid">
        {filteredNotes.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-8 text-center">
                <StickyNote className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? "No notes found matching your search." : "No notes yet. Create your first note to get started!"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow" data-testid={`note-${note.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2" data-testid={`text-note-title-${note.id}`}>
                    {note.title}
                  </CardTitle>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEdit(note)}
                      data-testid={`button-edit-${note.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNoteMutation.mutate(note.id)}
                      data-testid={`button-delete-${note.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p 
                  className="text-muted-foreground text-sm line-clamp-4 mb-4"
                  data-testid={`text-note-content-${note.id}`}
                >
                  {note.content}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1" data-testid={`tags-${note.id}`}>
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{note.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-3" data-testid={`text-note-date-${note.id}`}>
                  {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'No date'}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
