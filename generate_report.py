import os
import json
import re
from datetime import datetime
import hashlib
from typing import Dict, List, Optional, Set
import difflib
import yaml
import glob
from dataclasses import dataclass, asdict
import subprocess
from pathlib import Path

@dataclass
class FileMetadata:
    """Metadata for tracked files"""
    path: str
    language: str
    size: int
    last_modified: float
    hash: str
    dependencies: List[str]
    exports: List[str]
    doc_strings: List[str]
    functions: List[str]
    classes: List[str]

@dataclass
class ProjectContext:
    """Project-wide context information"""
    name: str
    type: str
    dependencies: Dict[str, str]
    dev_dependencies: Dict[str, str]
    entry_points: List[str]
    config_files: List[str]

class UniversalCodebaseAnalyzer:
    """Analyzes any codebase and maintains development context"""

    # Language-specific patterns
    PATTERNS = {
        'javascript': {
            'import': r'(?:import|require)\s*\(?[\'"]([^\'"]+)[\'"]',
            'export': r'export\s+(?:default\s+)?(?:class|function|const|let|var)\s+([A-Za-z0-9_]+)',
            'function': r'(?:function|const|let|var)\s+([A-Za-z0-9_]+)\s*=?\s*(?:\(|=>)',
            'class': r'class\s+([A-Za-z0-9_]+)',
        },
        'python': {
            'import': r'(?:from|import)\s+([A-Za-z0-9_.]+)',
            'export': r'__all__\s*=\s*\[([^\]]+)\]',
            'function': r'def\s+([A-Za-z0-9_]+)',
            'class': r'class\s+([A-Za-z0-9_]+)',
        },
        'typescript': {
            'import': r'(?:import|require)\s*\(?[\'"]([^\'"]+)[\'"]',
            'export': r'export\s+(?:default\s+)?(?:class|function|const|let|var|interface|type)\s+([A-Za-z0-9_]+)',
            'function': r'(?:function|const|let|var)\s+([A-Za-z0-9_]+)\s*=?\s*(?:\(|=>)',
            'class': r'(?:class|interface)\s+([A-Za-z0-9_]+)',
        }
    }

    def __init__(self, config_path: str = None):
        """Initialize with optional custom configuration"""
        self.config = self._load_config(config_path)
        self.file_metadata: Dict[str, FileMetadata] = {}
        self.project_context: Optional[ProjectContext] = None
        self.history: List[Dict] = []

    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from file or use defaults"""
        default_config = {
            'excluded_dirs': {
                'node_modules', '.git', 'dist', 'build', '__pycache__',
                'venv', 'env', '.env', 'coverage', '.idea', '.vscode'
            },
            'excluded_files': {
                '.DS_Store', '*.pyc', '*.pyo', '*.pyd', '*.so', '*.dylib',
                '*.log', '*.pot', '*.pid', '*.swp', '.env', '*.lock'
            },
            'max_file_size': 1024 * 1024,  # 1MB
            'track_history': True,
            'history_file': '.codebase_history.json',
            'languages': {
                '.py': 'python',
                '.js': 'javascript',
                '.jsx': 'javascript',
                '.ts': 'typescript',
                '.tsx': 'typescript',
                '.vue': 'javascript',
                '.rb': 'ruby',
                '.php': 'php',
                '.java': 'java',
                '.go': 'go',
                '.rs': 'rust',
                '.swift': 'swift',
                '.kt': 'kotlin',
                '.cpp': 'cpp',
                '.c': 'c',
            }
        }

        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                user_config = yaml.safe_load(f)
                if user_config:
                    # Merge user config with default config
                    for key, value in user_config.items():
                        if isinstance(value, dict):
                            default_config[key].update(value)
                        elif isinstance(value, set):
                            default_config[key].update(value)
                        else:
                            default_config[key] = value

        return default_config

    def analyze_project(self, root_dir: str) -> None:
        """Analyze entire project and generate context"""
        self.project_context = self._detect_project_type(root_dir)
        self._scan_files(root_dir)
        self._analyze_dependencies()
        if self.config['track_history']:
            self._update_history()

    def generate_report(self, output_path: str) -> None:
        """Generate comprehensive report of the codebase"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        report = {
            'timestamp': timestamp,
            'project': asdict(self.project_context) if self.project_context else {},
            'files': {path: asdict(metadata) for path, metadata in self.file_metadata.items()},
            'statistics': self._generate_statistics(),
            'dependencies': self._generate_dependency_graph(),
            'changes': self._analyze_changes()
        }

        # Save as both JSON and human-readable format
        base_path = os.path.splitext(output_path)[0]

        # JSON format for programmatic use
        with open(f"{base_path}.json", 'w') as f:
            json.dump(report, f, indent=2)

        # Human-readable format
        with open(f"{base_path}.txt", 'w') as f:
            self._write_human_readable_report(f, report)

    def _detect_project_type(self, root_dir: str) -> ProjectContext:
        """Detect project type and load relevant configuration"""
        indicators = {
            'package.json': 'node',
            'setup.py': 'python',
            'pom.xml': 'java',
            'cargo.toml': 'rust',
            'go.mod': 'go',
            'composer.json': 'php'
        }

        for indicator, proj_type in indicators.items():
            if os.path.exists(os.path.join(root_dir, indicator)):
                return self._load_project_context(root_dir, indicator, proj_type)

        return self._create_generic_context(root_dir)

    def _scan_files(self, root_dir: str) -> None:
        """Scan and analyze all relevant files in the project"""
        for root, dirs, files in os.walk(root_dir):
            # Skip excluded directories
            dirs[:] = [d for d in dirs if d not in self.config['excluded_dirs']]

            for file in files:
                if self._should_analyze_file(file):
                    file_path = os.path.join(root, file)
                    self._analyze_file(file_path)

    def _analyze_file(self, file_path: str) -> None:
        """Analyze individual file and extract metadata"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            file_ext = os.path.splitext(file_path)[1]
            language = self.config['languages'].get(file_ext, 'unknown')

            self.file_metadata[file_path] = FileMetadata(
                path=file_path,
                language=language,
                size=len(content),
                last_modified=os.path.getmtime(file_path),
                hash=self._calculate_file_hash(content),
                dependencies=self._extract_dependencies(content, language),
                exports=self._extract_exports(content, language),
                doc_strings=self._extract_doc_strings(content, language),
                functions=self._extract_functions(content, language),
                classes=self._extract_classes(content, language)
            )
        except Exception as e:
            print(f"Error analyzing {file_path}: {str(e)}")

    def _analyze_changes(self) -> Dict:
        """Analyze changes since last analysis"""
        if not self.history:
            return {}

        last_analysis = self.history[-1]
        changes = {
            'new_files': [],
            'modified_files': [],
            'deleted_files': [],
            'dependency_changes': []
        }

        # Compare with last analysis
        last_files = last_analysis['files']
        current_files = {path: asdict(metadata) for path, metadata in self.file_metadata.items()}

        for file_path, metadata in current_files.items():
            if file_path not in last_files:
                changes['new_files'].append(file_path)
            elif metadata['hash'] != last_files[file_path]['hash']:
                changes['modified_files'].append(file_path)

        for file_path in last_files:
            if file_path not in current_files:
                changes['deleted_files'].append(file_path)

        return changes

    def _write_human_readable_report(self, f, report: Dict) -> None:
        """Write report in human-readable format"""
        f.write(f"Codebase Analysis Report - {report['timestamp']}\n")
        f.write("=" * 80 + "\n\n")

        # Project Information
        f.write("Project Information\n")
        f.write("-" * 50 + "\n")
        for key, value in report['project'].items():
            f.write(f"{key}: {value}\n")
        f.write("\n")

        # Statistics
        f.write("Statistics\n")
        f.write("-" * 50 + "\n")
        stats = report['statistics']
        for key, value in stats.items():
            f.write(f"{key}: {value}\n")
        f.write("\n")

        # Changes
        if report['changes']:
            f.write("Recent Changes\n")
            f.write("-" * 50 + "\n")
            changes = report['changes']
            for change_type, files in changes.items():
                if files:
                    f.write(f"\n{change_type.capitalize()}:\n")
                    for file in files:
                        f.write(f"  - {file}\n")
            f.write("\n")

        # Dependencies
        f.write("Dependency Graph\n")
        f.write("-" * 50 + "\n")
        for module, deps in report['dependencies'].items():
            f.write(f"\n{module}:\n")
            for dep in deps:
                f.write(f"  - {dep}\n")

        # File Details
        f.write("\nFile Details\n")
        f.write("-" * 50 + "\n")
        for path, metadata in report['files'].items():
            f.write(f"\n{path}:\n")
            f.write(f"  Language: {metadata['language']}\n")
            f.write(f"  Size: {metadata['size']} bytes\n")
            if metadata['functions']:
                f.write("  Functions:\n")
                for func in metadata['functions']:
                    f.write(f"    - {func}\n")
            if metadata['classes']:
                f.write("  Classes:\n")
                for cls in metadata['classes']:
                    f.write(f"    - {cls}\n")

    def _calculate_file_hash(self, content: str) -> str:
        """Calculate hash of file content"""
        return hashlib.md5(content.encode()).hexdigest()

    def _should_analyze_file(self, filename: str) -> bool:
        """Determine if file should be analyzed"""
        return any(filename.endswith(ext) for ext in self.config['languages'].keys())

    def _extract_patterns(self, content: str, language: str, pattern_type: str) -> List[str]:
        """Extract patterns from file content based on language"""
        if language not in self.PATTERNS:
            return []

        pattern = self.PATTERNS[language].get(pattern_type)
        if not pattern:
            return []

        matches = re.finditer(pattern, content)
        return [match.group(1) for match in matches]

    def _extract_dependencies(self, content: str, language: str) -> List[str]:
        return self._extract_patterns(content, language, 'import')

    def _extract_exports(self, content: str, language: str) -> List[str]:
        return self._extract_patterns(content, language, 'export')

    def _extract_functions(self, content: str, language: str) -> List[str]:
        return self._extract_patterns(content, language, 'function')

    def _extract_classes(self, content: str, language: str) -> List[str]:
        return self._extract_patterns(content, language, 'class')

    def _extract_doc_strings(self, content: str, language: str) -> List[str]:
        """Extract documentation strings based on language"""
        doc_patterns = {
            'python': r'"""(.*?)"""',
            'javascript': r'/\*\*(.*?)\*/',
            'typescript': r'/\*\*(.*?)\*/'
        }

        if language not in doc_patterns:
            return []

        pattern = doc_patterns[language]
        matches = re.finditer(pattern, content, re.DOTALL)
        return [match.group(1).strip() for match in matches]

    def _generate_statistics(self) -> Dict:
        """Generate codebase statistics"""
        stats = {
            'total_files': len(self.file_metadata),
            'languages': {},
            'total_size': 0,
            'total_functions': 0,
            'total_classes': 0,
            'files_by_type': {}
        }

        for metadata in self.file_metadata.values():
            stats['languages'][metadata.language] = stats['languages'].get(metadata.language, 0) + 1
            stats['total_size'] += metadata.size
            stats['total_functions'] += len(metadata.functions)
            stats['total_classes'] += len(metadata.classes)

            file_ext = os.path.splitext(metadata.path)[1]
            stats['files_by_type'][file_ext] = stats['files_by_type'].get(file_ext, 0) + 1

        return stats

    def _generate_dependency_graph(self) -> Dict[str, List[str]]:
        """Generate dependency graph for the project"""
        graph = {}
        for path, metadata in self.file_metadata.items():
            graph[path] = list(metadata.dependencies)  # Convert set to list
        return graph

    def _load_project_context(self, root_dir: str, config_file: str, proj_type: str) -> ProjectContext:
        """Load project context based on project type and configuration file"""
        try:
            with open(os.path.join(root_dir, config_file), 'r') as f:
                if proj_type == 'node':
                    data = json.load(f)
                    return ProjectContext(
                        name=data.get('name', ''),
                        type=proj_type,
                        dependencies=data.get('dependencies', {}),
                        dev_dependencies=data.get('devDependencies', {}),
                        entry_points=[data.get('main', 'index.js')],
                        config_files=self._find_config_files(root_dir)
                    )
                elif proj_type == 'python':
                    # Handle setup.py
                    import ast
                    tree = ast.parse(f.read())
                    setup_args = {}
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Call) and getattr(node.func, 'id', '') == 'setup':
                            for keyword in node.keywords:
                                value = getattr(keyword.value, 's', None)
                                if value is not None:
                                    setup_args[keyword.arg] = value
                                else:
                                    # Handle non-string values if necessary
                                    setup_args[keyword.arg] = None
                    return ProjectContext(
                        name=setup_args.get('name', ''),
                        type=proj_type,
                        dependencies=setup_args.get('install_requires', []),
                        dev_dependencies=setup_args.get('extras_require', {}).get('dev', []),
                        entry_points=setup_args.get('entry_points', []),
                        config_files=self._find_config_files(root_dir)
                    )
                # Add other project types as needed
        except Exception as e:
            print(f"Error loading project context: {str(e)}")
            return self._create_generic_context(root_dir)

    def _create_generic_context(self, root_dir: str) -> ProjectContext:
        """Create a generic project context when type cannot be determined"""
        return ProjectContext(
            name=os.path.basename(root_dir),
            type='generic',
            dependencies={},
            dev_dependencies={},
            entry_points=[],
            config_files=self._find_config_files(root_dir)
        )

    def _find_config_files(self, root_dir: str) -> List[str]:
        """Find all configuration files in the project"""
        config_patterns = [
            '*.json',
            '*.yaml',
            '*.yml',
            '*.toml',
            '*.ini',
            '*.cfg',
            '.env*',
            '.git*',
            'requirements.txt',
            'setup.cfg',
            'tox.ini',
            'Dockerfile',
            'docker-compose.yml'
        ]

        config_files = []
        for pattern in config_patterns:
            config_files.extend(
                str(p.relative_to(root_dir))
                for p in Path(root_dir).rglob(pattern)
                if not any(excluded in str(p) for excluded in self.config['excluded_dirs'])
            )
        return config_files

    def _analyze_dependencies(self) -> None:
        """Analyze project dependencies and their relationships"""
        dependency_tree = {}
        circular_deps = set()

        def build_dep_tree(file_path: str, visited: Set[str] = None):
            if visited is None:
                visited = set()

            if file_path in visited:
                circular_deps.add(file_path)
                return

            visited.add(file_path)
            metadata = self.file_metadata.get(file_path)
            if metadata:
                dependencies = []
                for dep in metadata.dependencies:
                    # Resolve relative imports
                    full_dep_path = self._resolve_import_path(file_path, dep)
                    if full_dep_path:
                        dependencies.append(full_dep_path)
                        build_dep_tree(full_dep_path, visited.copy())

                dependency_tree[file_path] = dependencies

        for file_path in self.file_metadata:
            build_dep_tree(file_path)

        self.dependency_tree = dependency_tree
        self.circular_dependencies = circular_deps

    def _resolve_import_path(self, source_file: str, import_path: str) -> Optional[str]:
        """Resolve relative import paths to absolute paths"""
        try:
            if import_path.startswith('.'):
                # Relative import
                source_dir = os.path.dirname(source_file)
                parts = import_path.split('/')
                current_path = source_dir

                for part in parts:
                    if part == '.':
                        continue
                    elif part == '..':
                        current_path = os.path.dirname(current_path)
                    else:
                        current_path = os.path.join(current_path, part)

                # Try common extensions
                for ext in ['.js', '.jsx', '.ts', '.tsx', '.py']:
                    potential_path = current_path + ext
                    if os.path.exists(potential_path):
                        return potential_path

                # Try index files
                for ext in ['.js', '.jsx', '.ts', '.tsx']:
                    index_path = os.path.join(current_path, 'index' + ext)
                    if os.path.exists(index_path):
                        return index_path

            return None
        except Exception:
            return None

    def _update_history(self) -> None:
        """Update the project history with current analysis"""
        history_path = os.path.join(self.project_context.name, self.config['history_file'])

        # Ensure the directory exists
        history_dir = os.path.dirname(history_path)
        if not os.path.exists(history_dir):
            os.makedirs(history_dir, exist_ok=True)

        current_analysis = {
            'timestamp': datetime.now().isoformat(),
            'files': {
                path: asdict(metadata)
                for path, metadata in self.file_metadata.items()
            },
            'changes': self._analyze_changes()
        }

        try:
            if os.path.exists(history_path):
                with open(history_path, 'r') as f:
                    history = json.load(f)
                    self.history = history.get('analyses', [])
            else:
                self.history = []

            self.history.append(current_analysis)

            # Keep only last 10 analyses to manage file size
            if len(self.history) > 10:
                self.history = self.history[-10:]

            with open(history_path, 'w') as f:
                json.dump({'analyses': self.history}, f, indent=2)

        except Exception as e:
            print(f"Error updating history: {str(e)}")

    def analyze_complexity(self) -> Dict[str, Dict]:
        """Analyze code complexity metrics for each file"""
        complexity_metrics = {}

        for file_path, metadata in self.file_metadata.items():
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                metrics = {
                    'cyclomatic_complexity': self._calculate_cyclomatic_complexity(content, metadata.language),
                    'cognitive_complexity': self._calculate_cognitive_complexity(content, metadata.language),
                    'nesting_depth': self._calculate_max_nesting(content, metadata.language),
                    'lines_of_code': len(content.splitlines()),
                    'comment_ratio': self._calculate_comment_ratio(content, metadata.language)
                }

                complexity_metrics[file_path] = metrics

            except Exception as e:
                print(f"Error analyzing complexity for {file_path}: {str(e)}")

        return complexity_metrics

    # Placeholder methods for complexity analysis (to be implemented)
    def _calculate_cyclomatic_complexity(self, content: str, language: str) -> int:
        """Calculate cyclomatic complexity (placeholder)"""
        return 0

    def _calculate_cognitive_complexity(self, content: str, language: str) -> int:
        """Calculate cognitive complexity (placeholder)"""
        return 0

    def _calculate_max_nesting(self, content: str, language: str) -> int:
        """Calculate maximum nesting depth (placeholder)"""
        return 0

    def _calculate_comment_ratio(self, content: str, language: str) -> float:
        """Calculate comment ratio (placeholder)"""
        return 0.0

if __name__ == "__main__":
    # Example usage
    analyzer = UniversalCodebaseAnalyzer()

    # Get current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))

    # Analyze project
    analyzer.analyze_project(current_dir)

    # Generate report
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    analyzer.generate_report(f"codebase_report_{timestamp}")