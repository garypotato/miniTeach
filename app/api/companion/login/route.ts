import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getProductsWithMetafields } from "@/app/services/shopify";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

interface CompanionData {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  password: string;
  wechat_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user_name, password } = await request.json();

    if (!user_name || !password) {
      return NextResponse.json(
        { success: false, error: "用户名和密码都是必填项" },
        { status: 400 }
      );
    }

    // Fetch all companions from Shopify
    const result = await getProductsWithMetafields({
      collection_id: "491355177275", // Companion collection ID
      status: "active",
      published_status: "published",
      limit: 250, // Get all companions
    });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: "获取陪伴师数据失败" },
        { status: 500 }
      );
    }

    // Find companion by user_name or wechat_id
    let matchedCompanion: CompanionData | null = null;

    for (const product of result.data) {
      const metafields = product.metafields || [];

      const companionData: Partial<CompanionData> = {
        id: product.id,
      };

      // Extract metafields
      metafields.forEach(
        (metafield: { namespace: string; key: string; value: string }) => {
          if (metafield.namespace === "custom") {
            switch (metafield.key) {
              case "first_name":
                companionData.first_name = metafield.value;
                break;
              case "last_name":
                companionData.last_name = metafield.value;
                break;
              case "user_name":
                companionData.user_name = metafield.value;
                break;
              case "password":
                companionData.password = metafield.value;
                break;
              case "wechat_id":
                companionData.wechat_id = metafield.value;
                break;
            }
          }
        }
      );

      // Check if this companion matches the login credentials
      if (companionData.user_name && companionData.password) {
        // Standard login with user_name and password
        if (companionData.user_name === user_name) {
          matchedCompanion = companionData as CompanionData;
          break;
        }
      } else if (companionData.wechat_id) {
        // Fallback: if no user_name/password, check if both fields match wechat_id
        if (
          user_name === companionData.wechat_id &&
          password === companionData.wechat_id
        ) {
          matchedCompanion = {
            ...companionData,
            user_name: companionData.wechat_id,
            password: companionData.wechat_id,
          } as CompanionData;
          break;
        }
      }
    }

    if (!matchedCompanion) {
      return NextResponse.json(
        { success: false, error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // Verify password
    let passwordValid = false;

    if (matchedCompanion.password) {
      // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      if (matchedCompanion.password.startsWith("$2")) {
        // Compare with hashed password
        passwordValid = await bcrypt.compare(
          password,
          matchedCompanion.password
        );
      } else {
        // Plain text password comparison (for backward compatibility)
        passwordValid = password === matchedCompanion.password;
      }
    }

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        companionId: matchedCompanion.id,
        user_name: matchedCompanion.user_name,
        first_name: matchedCompanion.first_name,
        last_name: matchedCompanion.last_name,
      },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    return NextResponse.json({
      success: true,
      token,
      companion: {
        id: matchedCompanion.id,
        user_name: matchedCompanion.user_name,
        first_name: matchedCompanion.first_name,
        last_name: matchedCompanion.last_name,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}
