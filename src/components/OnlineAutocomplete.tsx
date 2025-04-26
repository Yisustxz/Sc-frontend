import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { debounce } from "lodash";

// Interfaz genérica para cualquier tipo de opción
interface Option {
  id: string | number;
  [key: string]: any;
}

interface OnlineAutocompleteProps<T extends Option> {
  options: T[];
  onChange: (value: T | null) => void;
  getOptionLabel: (option: T) => string;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  loading?: boolean;
  searchFn: (searchTerm: string) => void;
  noOptionsText?: string;
  loadingText?: string;
  originalValue?: string | number | null;
  currentValue?: string | number | null;
  fullWidth?: boolean;
}

function OnlineAutocomplete<T extends Option>({
  options,
  onChange,
  getOptionLabel,
  label,
  placeholder,
  error,
  required = false,
  loading = false,
  searchFn,
  noOptionsText = "No se encontraron resultados",
  loadingText = "Buscando...",
  originalValue,
  currentValue,
  fullWidth = true,
}: OnlineAutocompleteProps<T>) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState<T | null>(null);

  // Calcular si el valor ha sido modificado
  const isModified = currentValue !== undefined && currentValue !== originalValue;

  useEffect(() => {
    if (options.length <= 0) {
      return; 
    }

    if (isModified && currentValue) {
      const option = options.find((option) => option.id === currentValue);
      if (option && option.id !== value?.id) {
        setValue(option);
      }
    } else if (originalValue) {
      const option = options.find((option) => option.id === originalValue);
      if (option && option.id !== value?.id) {
        setValue(option);
      }
    }
  }, [currentValue, isModified, options, originalValue, value?.id]);

  // Debounce para la búsqueda
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (!isSelecting) {
        searchFn(value);
      }
    }, 500),
    [isSelecting, searchFn]
  );

  // Manejar búsqueda
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch, setSearchTerm]);

  // Manejar selección
  const handleSelect = useCallback((_: React.SyntheticEvent, newValue: T | null) => {
    setIsSelecting(true);
    onChange(newValue);
    // Resetear la bandera después de un breve retraso
    setTimeout(() => {
      setIsSelecting(false);
      // Limpiamos el término de búsqueda para evitar interferencias
      setSearchTerm("");
    }, 300);
  }, [onChange]);

  return (
    <FormControl fullWidth={fullWidth} error={!!error}>
      {value && (
        <Typography variant="caption" sx={{ mb: 1, fontStyle: 'italic', display: 'block' }}>
          Selección actual: {getOptionLabel(value)}
          {isModified && (
            <Box component="span" sx={{ ml: 1, color: 'warning.main' }}>(Modificado)</Box>
          )}
        </Typography>
      )}
      <Autocomplete
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        loading={loading}
        onChange={handleSelect}
        onInputChange={(_, newInputValue, reason) => {
          // Solo actualizar la búsqueda si el cambio viene del usuario (no de la selección)
          if (reason === 'input' && !isSelecting) {
            handleSearchChange(newInputValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            required={required}
            error={!!error}
            helperText={error}
          />
        )}
        filterOptions={(options, state) => {
          // Filtrado local basado en el término de búsqueda
          const inputValue = state.inputValue.toLowerCase();
          return options.filter((option) =>
            getOptionLabel(option).toLowerCase().includes(inputValue)
          );
        }}
        noOptionsText={noOptionsText}
        loadingText={loadingText}
        blurOnSelect={false}
        clearOnBlur={false}
      />
    </FormControl>
  );
}

export default OnlineAutocomplete;
