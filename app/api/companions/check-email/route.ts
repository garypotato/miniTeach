import { NextRequest, NextResponse } from "next/server";
import { checkUserNameExists } from "../../../services/shopify/client";

// POST - Check if email (user_name) already exists
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if user_name (email) already exists using GraphQL
    try {
      const exists = await checkUserNameExists(email);
      
      if (exists) {
        return NextResponse.json({
          success: true,
          available: false,
          message: "此電子郵件地址已被使用"
        });
      }

      return NextResponse.json({
        success: true,
        available: true,
        message: "電子郵件地址可用"
      });

    } catch (checkError) {
      console.error("Error checking existing companions:", checkError);
      return NextResponse.json(
        { success: false, error: "無法驗證電子郵件唯一性，請稍後重試" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error in email check:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}