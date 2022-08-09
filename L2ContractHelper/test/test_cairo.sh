if [[ $# -ne 1 ]]; then
  echo "Error: must pass in *only* name of cairo file"
else
  PROGRAM_RAW_NAME=$(echo $1 | cut -d'.' -f 1)
  cairo-compile $PROGRAM_RAW_NAME.cairo --output $PROGRAM_RAW_NAME.json && \
  cairo-run --program=$PROGRAM_RAW_NAME.json \
      --print_output --layout=small
  rm $PROGRAM_RAW_NAME.json
fi