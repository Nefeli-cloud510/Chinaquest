from __future__ import annotations

import argparse
from pathlib import Path

import trimesh


def convert_obj_to_glb(input_path: Path, output_path: Path) -> None:
    loaded = trimesh.load(input_path, force="scene", process=False)

    if loaded is None:
        raise RuntimeError(f"Failed to load model: {input_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    loaded.export(output_path, file_type="glb")


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert OBJ to GLB for web AR usage.")
    parser.add_argument("input", type=Path, help="Path to the source OBJ file")
    parser.add_argument("output", type=Path, help="Path to the target GLB file")
    args = parser.parse_args()

    convert_obj_to_glb(args.input.resolve(), args.output.resolve())


if __name__ == "__main__":
    main()
