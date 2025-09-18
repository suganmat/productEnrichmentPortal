import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BarChart3 } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Category Management Portal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Streamline your product categorization and variant grouping with intelligent automation and collaborative workflows
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="px-8 py-3 text-lg"
            data-testid="login-button"
          >
            <Shield className="w-5 h-5 mr-2" />
            Sign In with SSO
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Smart Categorization</CardTitle>
              <CardDescription>
                AI-powered category mapping with confidence scores and intelligent suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and approve ML suggestions for accurate product categorization
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Product Grouping</CardTitle>
              <CardDescription>
                Intuitive drag-and-drop interface for organizing product variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Group related products by attributes like size, color, and specifications
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Multi-user portal with organization-based authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Secure access control with role-based permissions and audit trails
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>Secure enterprise portal • Contact your administrator for access</p>
        </div>
      </div>
    </div>
  );
}