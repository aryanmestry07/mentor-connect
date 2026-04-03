from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
import tempfile
import os

router = APIRouter()


class CodeRequest(BaseModel):
    code: str
    language: str


@router.post("/run-code")
def run_code(data: CodeRequest):
    code = data.code
    language = data.language

    if not code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    try:
        # 🔥 PYTHON EXECUTION
        if language == "python":
            result = subprocess.run(
                ["python", "-c", code],
                capture_output=True,
                text=True,
                timeout=5
            )

            return {
                "output": result.stdout,
                "error": result.stderr
            }

        # 🔥 JAVASCRIPT EXECUTION (Node.js required)
        elif language == "javascript":
            result = subprocess.run(
                ["node", "-e", code],
                capture_output=True,
                text=True,
                timeout=5
            )

            return {
                "output": result.stdout,
                "error": result.stderr
            }

        # 🔥 C++ EXECUTION
        elif language == "cpp":
            with tempfile.NamedTemporaryFile(delete=False, suffix=".cpp") as f:
                f.write(code.encode())
                file_name = f.name

            exe_file = file_name.replace(".cpp", ".exe")

            # Compile
            compile_process = subprocess.run(
                ["g++", file_name, "-o", exe_file],
                capture_output=True,
                text=True
            )

            if compile_process.stderr:
                return {"output": "", "error": compile_process.stderr}

            # Run
            run_process = subprocess.run(
                [exe_file],
                capture_output=True,
                text=True,
                timeout=5
            )

            os.remove(file_name)
            os.remove(exe_file)

            return {
                "output": run_process.stdout,
                "error": run_process.stderr
            }

        # 🔥 JAVA EXECUTION
        elif language == "java":
            with tempfile.TemporaryDirectory() as temp_dir:
                file_path = os.path.join(temp_dir, "Main.java")

                with open(file_path, "w") as f:
                    f.write(code)

                # Compile
                compile_process = subprocess.run(
                    ["javac", file_path],
                    capture_output=True,
                    text=True
                )

                if compile_process.stderr:
                    return {"output": "", "error": compile_process.stderr}

                # Run
                run_process = subprocess.run(
                    ["java", "-cp", temp_dir, "Main"],
                    capture_output=True,
                    text=True,
                    timeout=5
                )

                return {
                    "output": run_process.stdout,
                    "error": run_process.stderr
                }

        else:
            raise HTTPException(status_code=400, detail="Unsupported language")

    except subprocess.TimeoutExpired:
        return {
            "output": "",
            "error": "Execution timed out"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))