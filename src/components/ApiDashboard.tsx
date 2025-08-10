import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Plus, 
  Edit2, 
  Trash2, 
  Server, 
  Activity,
  Globe,
  Code2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface ApiRecord {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

const ApiDashboard = () => {
  const { toast } = useToast();
  const [records, setRecords] = useState<ApiRecord[]>([
    { id: "1", name: "John Doe", email: "aswanthsagabala1721@gmail.com", status: "active", createdAt: "2024-01-15" },
    { id: "2", name: "Jane Smith", email: "avinash@gmail.com", status: "pending", createdAt: "2024-01-14" },
    { id: "3", name: "Bob Johnson", email: "tejanandhan@gmail.com", status: "inactive", createdAt: "2024-01-13" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active"
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string>("");

  const handleCreate = () => {
    const newRecord: ApiRecord = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRecords([...records, newRecord]);
    setFormData({ name: "", email: "", status: "active" });
    setApiResponse(`POST /api/users - Status: 201 Created\n${JSON.stringify(newRecord, null, 2)}`);
    
    toast({
      title: "Record Created",
      description: "New user record has been successfully created via API.",
    });
  };

  const handleUpdate = (id: string) => {
    setRecords(records.map(record => 
      record.id === id 
        ? { ...record, ...formData }
        : record
    ));
    setEditingId(null);
    setFormData({ name: "", email: "", status: "active" });
    setApiResponse(`PUT /api/users/${id} - Status: 200 OK\n${JSON.stringify({ id, ...formData }, null, 2)}`);
    
    toast({
      title: "Record Updated",
      description: "User record has been successfully updated via API.",
    });
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
    setApiResponse(`DELETE /api/users/${id} - Status: 204 No Content`);
    
    toast({
      title: "Record Deleted",
      description: "User record has been successfully deleted via API.",
      variant: "destructive",
    });
  };

  const handleEdit = (record: ApiRecord) => {
    setFormData({
      name: record.name,
      email: record.email,
      status: record.status
    });
    setEditingId(record.id);
    setApiResponse(`GET /api/users/${record.id} - Status: 200 OK\n${JSON.stringify(record, null, 2)}`);
  };

  const simulateApiCall = (method: string, endpoint: string) => {
    const response = {
      method,
      endpoint,
      status: "200 OK",
      timestamp: new Date().toISOString(),
      data: records
    };
    setApiResponse(`${method} ${endpoint} - Status: 200 OK\n${JSON.stringify(response, null, 2)}`);
    
    toast({
      title: "API Call Simulated",
      description: `${method} request to ${endpoint} executed successfully.`,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary", 
      inactive: "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">API Integration Dashboard</h1>
            <p className="text-muted-foreground">Demonstrating RESTful API operations and server-client communication</p>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="text-primary border-primary">
              <Activity className="h-3 w-3 mr-1" />
              API Online
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Records</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{records.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">Active Users</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {records.filter(r => r.status === 'active').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {records.filter(r => r.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">Inactive</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {records.filter(r => r.status === 'inactive').length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CRUD Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                CRUD Operations
              </CardTitle>
              <CardDescription>
                Create, Read, Update, and Delete operations through RESTful API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter user name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                {editingId ? (
                  <>
                    <Button onClick={() => handleUpdate(editingId)} className="flex-1">
                      Update Record
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingId(null);
                        setFormData({ name: "", email: "", status: "active" });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleCreate} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Record
                  </Button>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>API Testing</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => simulateApiCall('GET', '/api/users')}
                  >
                    GET All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => simulateApiCall('GET', '/api/users/1')}
                  >
                    GET Single
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                API Response
              </CardTitle>
              <CardDescription>
                Real-time API response data and status codes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={apiResponse}
                readOnly
                placeholder="API responses will appear here..."
                className="min-h-[300px] font-mono text-xs"
              />
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Records</CardTitle>
            <CardDescription>
              Manage user data through RESTful API operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{record.name}</p>
                    <p className="text-sm text-muted-foreground">{record.email}</p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(record.status)}
                      <span className="text-xs text-muted-foreground">Created: {record.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(record)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiDashboard;