import { validateObjectId } from "@/lib/validateObjectId";
import { Admin, validateLoginUser } from "@/Modules/Admin";
import { NextRequest, NextResponse } from "next/server";

export const LoginAdmin = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { error } = validateLoginUser(body);
    if (error) {
      return NextResponse.json(
        { message: error.details[0].message },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ userName: body.userName });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      admin,
      message: "Login successful",
    });

    return response;
  } catch (err) {
    console.error("[LoginAdmin Error]", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

export const checkIsAdmin = async (
  req: NextRequest,
  context: { params: Promise<{ adminID: string }> }
) => {
  try {
    const { adminID } = await context.params;
    const validationResponse = validateObjectId(adminID);
    if (validationResponse) return validationResponse;
    const admin = await Admin.findById(adminID)
    if(!admin) return NextResponse.json({
        
    })
  } catch (err) {
    console.error("[LoginAdmin Error]", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
