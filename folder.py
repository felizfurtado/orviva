import os

IGNORE = {
    "frontend",
    "__pycache__",
    ".git",
    ".venv",
    "venv",
    "node_modules",
    ".idea",
    ".vscode"
}

def print_tree(path=".", prefix=""):
    try:
        items = sorted(
            [item for item in os.listdir(path) if item not in IGNORE]
        )

        for i, item in enumerate(items):
            full_path = os.path.join(path, item)
            is_last = i == len(items) - 1

            connector = "└── " if is_last else "├── "
            print(prefix + connector + item)

            if os.path.isdir(full_path):
                extension = "    " if is_last else "│   "
                print_tree(full_path, prefix + extension)

    except PermissionError:
        pass


if __name__ == "__main__":
    root = os.path.basename(os.path.abspath("."))
    print(root)
    print_tree()