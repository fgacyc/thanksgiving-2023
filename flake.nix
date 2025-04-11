{
  description = "Nix environment for development.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-root.url = "github:srid/flake-root";
  };

  outputs = inputs@{ nixpkgs, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; }
      {
        imports = [
          inputs.flake-root.flakeModule
        ];
        systems = [
          "x86_64-linux"
          "aarch64-linux"
          "aarch64-darwin"
        ];
        perSystem = { pkgs, lib, config, ... }: {
          devShells.default = pkgs.mkShell rec {
            inputsFrom = [ config.flake-root.devShell ];

            name = "thanksgiving";

            # dev tools
            nativeBuildInputs = with pkgs; [
              pkg-config # package finder

              nodejs # node javascript runtime
              nodePackages.pnpm # pnpm
            ];

            # libraries
            buildInputs = with pkgs; [ openssl ];

            shellHook = ''
              export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath buildInputs}:$LD_LIBRARY_PATH"
            '';
          };
        };
      };
}

