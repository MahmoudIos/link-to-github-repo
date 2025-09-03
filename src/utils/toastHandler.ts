import { toast } from "@/hooks/use-toast";
import type { ApiResponseDto } from "@/types/apiResponse";

// Handle API response and show appropriate toast
export const handleApiResponse = <T>(response: ApiResponseDto<T>) => {
  if (!response.success) {
    const errorMessage = response.errors.length > 0 
      ? response.errors.join(", ") 
      : "An unknown error occurred";
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    return null;
  } else {
    toast({
      title: "Success",
      description: response.message,
    });
    return response.data;
  }
};

// Handle error cases (for mutations)
export const handleApiError = (error: any) => {
  const errorMessage = error?.response?.data?.errors?.join(", ") || 
                      error?.response?.data?.message || 
                      error?.message || 
                      "Something went wrong";
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};

// Handle success cases (for mutations)
export const handleApiSuccess = (message: string) => {
  toast({
    title: "Success",
    description: message,
  });
};